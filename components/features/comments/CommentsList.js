'use client';

import { useEffect, useMemo } from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useCommentParentChain, useExpandToComment } from '@/hooks/useCommentParentChain';
import { fetchCommentsByPostId } from '@/lib/api/client/commentsClient';
import CommentItem from './CommentItem';
import Skeleton from '@/components/ui/Skeleton';

async function fetchRepliesCount(parentId) {
  const res = await fetch(`/api/comments?parent=${parentId}&per_page=1`);
  const total = parseInt(res.headers.get('X-WP-Total') || '0', 10);
  return Number.isFinite(total) ? total : 0;
}

async function fetchReplies(parentId) {
  const res = await fetch(`/api/comments?parent=${parentId}`);
  if (!res.ok) throw new Error('Errore nel caricamento risposte');
  return res.json();
}

export default function CommentsList({ post, setReplyToCommentId, setFormData }) {
  const queryClient = useQueryClient();
  const { parentChain, ready } = useCommentParentChain();

  // --- Scroll al commento selezionato ---
  useEffect(() => {
    if (!ready) return;
    const commentId = parseInt(window.location.hash.replace('#comment-', ''), 10);
    if (!commentId || !parentChain.includes(commentId)) return;

    let tries = 0;
    const maxTries = 50;
    const interval = setInterval(() => {
      const el = document.getElementById(`comment-${commentId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.querySelectorAll(':scope > div')[0].classList.add('animate-blink');
        setTimeout(() => el.classList.remove('animate-blink'), 2000);
        clearInterval(interval);
      } else if (tries++ > maxTries) clearInterval(interval);
    }, 50);
  }, [ready, parentChain]);

  // --- Fetch principale dei commenti ---
  const {
    data: comments = [],
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchCommentsByPostId(post.id),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  // --- Manteniamo solo commenti unici (protezione extra) ---
  const uniqueComments = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => map.set(c.id, c));
    return Array.from(map.values());
  }, [comments]);

  // --- Conteggi top-level via useQueries ---
  const mainCommentsIds = useMemo(() => uniqueComments.map((c) => c.id), [uniqueComments]);

  const countsQueries = useQueries({
    queries: mainCommentsIds.map((id) => ({
      queryKey: ['comments', 'count', id],
      queryFn: () => fetchRepliesCount(id),
      enabled: !!id,
      staleTime: 60_000,
      retry: 1,
    })),
  });

  const countsMap = useMemo(() => {
    return Object.fromEntries(mainCommentsIds.map((id, i) => [id, countsQueries[i]?.data ?? 0]));
  }, [mainCommentsIds, countsQueries]);

  const prefetchReplies = (id) =>
    queryClient.prefetchQuery({
      queryKey: ['comments', 'replies', id],
      queryFn: () => fetchReplies(id),
    });

  /*     let renderComments = (
            <ul className="space-y-4">
                {uniqueComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        level={0}
                        initialCount={countsMap[comment.id] ?? 0}
                        onReply={() => setReplyToCommentId(comment.id)}
                        onPrefetchReplies={() => prefetchReplies(comment.id)}
                        prefetchReplies={prefetchReplies}
                        fetchRepliesCount={fetchRepliesCount}
                        fetchReplies={fetchReplies}
                        queryClient={queryClient}
                        setFormData={setFormData}
                        postId={post.id}
                        parentChain={parentChain}
                    />
                ))}
            </ul>
        )
     */

  function CommentsSection({ children }) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Commenti</h2>
        {children}
      </section>
    );
  }

  if (isLoading)
    return (
      <CommentsSection>
        <ul className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="comment" height={90} />
          ))}
        </ul>
      </CommentsSection>
    );
  if (isError)
    return (
      <CommentsSection>
        <p className="text-red-500">Errore: {error?.message}</p>;
      </CommentsSection>
    );

  if (!uniqueComments.length)
    return (
      <CommentsSection>
        <p>Nessun commento.</p>
      </CommentsSection>
    );

  return (
    <CommentsSection>
      <ul className="flex flex-col gap-4">
        {uniqueComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            level={0}
            initialCount={countsMap[comment.id] ?? 0}
            onReply={() => setReplyToCommentId(comment.id)}
            onPrefetchReplies={() => prefetchReplies(comment.id)}
            prefetchReplies={prefetchReplies}
            fetchRepliesCount={fetchRepliesCount}
            fetchReplies={fetchReplies}
            queryClient={queryClient}
            setFormData={setFormData}
            postId={post.id}
            parentChain={parentChain}
          />
        ))}
      </ul>
    </CommentsSection>
  );
}
