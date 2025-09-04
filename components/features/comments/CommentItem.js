import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { useWS } from '@/context/WSContext';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

export default React.memo(function CommentItem({
  comment,
  level = 0,
  initialCount = 0,
  onReply,
  onPrefetchReplies,
  prefetchReplies,
  fetchRepliesCount,
  fetchReplies,
  queryClient,
  setFormData,
  postId,
  parentChain,
}) {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const isUserComment = user?.id === comment.author;
  const [deleteButtonRef, setDeleteButtonRef] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [likes, setLikes] = useState(comment.meta.likes_count || 0);
  const [isLiked, setIsLiked] = useState(comment.meta.likes_users?.includes(user?.id));
  const { sendMessage, subscribe } = useWS();

  useEffect(() => {
    // Se il commento è incluso nella catena dei parent → espandilo
    if (parentChain.includes(comment.id)) {
      setExpanded(true);
    }
  }, [parentChain, comment.id]);

  useEffect(() => {
    // ricevo solo commenti nuovi
    const unsubscribe = subscribe('comment', async (comment) => {
      await queryClient.invalidateQueries({ queryKey: ['comments', comment.poost] });
      await queryClient.invalidateQueries({
        queryKey: ['comments', 'replies', comment.parent || 0],
      });
      await queryClient.invalidateQueries({ queryKey: ['comments', 'count', comment.parent || 0] });
    });

    return () => unsubscribe();
  }, [subscribe, queryClient]);

  // Count per QUALSIASI commento (per i top-level usiamo initialData)
  const {
    data: replyCount = initialCount,
    isFetching: countLoading,
    isError: countError,
  } = useQuery({
    queryKey: ['comments', 'count', comment.id],
    queryFn: () => fetchRepliesCount(comment.id),
    // Se è top-level, abbiamo già il count iniziale: evitiamo un fetch immediato
    initialData: comment.parent === 0 ? initialCount : undefined,
    // Per i figli, abilita sempre (così ottieni il count la prima volta che compaiono)
    enabled: true,
    staleTime: 60_000,
    retry: 1,
  });

  // Replies on demand
  const {
    data: replies = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ['comments', 'replies', comment.id],
    queryFn: () => fetchReplies(comment.id),
    enabled: expanded, // fetcha solo quando espanso
    staleTime: 60_000,
    retry: 1,
  });

  const toggle = () => setExpanded((v) => !v);

  const handleEdit = () => {
    setFormData({
      comment: comment.id,
      content: comment.content.rendered.replace(/<[^>]*>?/gm, ''),
    });
  };

  const handleDelete = async (deleteButtonRef) => {
    if (!deleteButtonRef) {
      setDeleteButtonRef(true);
      return;
    }
    setIsLoadingDelete(true);
    const res = await fetch(`/api/comments/${comment.id}`, { method: 'DELETE' });

    if (!res) {
      alert('Errore durante eliminazione commento');
      return;
    }

    const sendWS = sendMessage({ type: 'comment', data: comment });
    if (!sendWS) {
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      await queryClient.invalidateQueries({
        queryKey: ['comments', 'replies', comment.parent || 0],
      });
      await queryClient.invalidateQueries({ queryKey: ['comments', 'count', comment.parent || 0] });
    }
    setIsLoadingDelete(false);
  };

  const handleLike = async () => {
    setIsLoadingLike(true);
    if (!user) {
      alert('Devi essere loggato per mettere mi piace'); // TODO: meglio un modal con invito al login
      return;
    }
    const prevLiked = isLiked;

    // optimistic update
    setLikes((l) => (isLiked ? l - 1 : l + 1));
    setIsLiked(!prevLiked);

    const likeAction = isLiked ? 'DELETE' : 'POST';
    const res = await fetch(`/api/comments/${comment.id}/like`, { method: likeAction });

    if (!res) {
      setLikes((l) => (isLiked ? l + 1 : l - 1));
      setIsLiked(prevLiked);
      alert('Errore durante il like');
      return;
    }
    setIsLoadingLike(false);

    // Invalida le query rilevanti
    await queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    await queryClient.invalidateQueries({ queryKey: ['comments', 'replies', comment.parent || 0] });
    await queryClient.invalidateQueries({ queryKey: ['comments', 'count', comment.parent || 0] });
  };

  const totalRepliesCount = replyCount || 0;
  return (
    <li style={{ marginLeft: `${level * 20}px` }} id={`comment-${comment.id}`}>
      <div className="border p-4 rounded-md bg-gray-50 relative">
        <p className="text-sm text-gray-600 mb-1">
          <strong>{comment?.author_name}</strong> ha scritto:
        </p>

        <div
          className="prose prose-sm"
          dangerouslySetInnerHTML={{ __html: comment?.content.rendered }}
        />

        {countError && <p className="text-xs text-red-600 mt-1">Errore nel conteggio risposte.</p>}

        {totalRepliesCount > 0 && (
          <button
            className="font-bold hover:underline text-sm mt-2 mr-2"
            onMouseEnter={onPrefetchReplies}
            onClick={toggle}
            disabled={countLoading}
          >
            {expanded ? 'Nascondi risposte' : `Mostra ${totalRepliesCount} commenti`}
          </button>
        )}
        {isFetching && (
          <div className="mt-2">
            <Spinner size="sm" color="gray-500" />
          </div>
        )}
        {user && (
          <button onClick={onReply} className="text-blue-600 hover:underline text-sm mt-2">
            Rispondi
          </button>
        )}
        {isUserComment && (
          <>
            <button
              className="ml-2 hover:underline text-sm font-medium transition"
              onClick={handleEdit}
            >
              Modifica
            </button>
            <button
              className="ml-2 text-red-600 hover:underline text-sm font-medium transition"
              onClick={() => handleDelete(deleteButtonRef)}
            >
              {deleteButtonRef
                ? !isLoadingDelete
                  ? 'Conferma eliminazione'
                  : 'Eliminazione...'
                : 'Elimina'}
            </button>
          </>
        )}
        <button
          onClick={handleLike}
          disabled={isLoadingLike}
          className="text-blue-600 hover:underline absolute top-2 right-2 text-sm mt-2"
        >
          {isLoadingLike ? (
            <Spinner size={4} />
          ) : (
            `(${likes}) ${isLiked ? ' Rimuovi mi piace' : 'Mi piace'}`
          )}
        </button>

        {isError && <p className="text-xs text-red-600 mt-2">Errore nel caricamento risposte.</p>}
      </div>

      {expanded && (
        <ul>
          {replies.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              level={level + 1}
              // Per i figli non abbiamo countsMap: il loro count arriverà da useQuery
              initialCount={0}
              onReply={() => onReply(child.id)}
              onPrefetchReplies={() => prefetchReplies(child.id)}
              prefetchReplies={prefetchReplies}
              fetchRepliesCount={fetchRepliesCount}
              fetchReplies={fetchReplies}
              queryClient={queryClient}
              setFormData={setFormData}
              postId={postId}
              parentChain={parentChain}
            />
          ))}
        </ul>
      )}
    </li>
  );
});
