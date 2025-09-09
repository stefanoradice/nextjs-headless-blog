'use client';
import { useAuth } from '@/context/AuthContext';
import { useWS } from '@/context/WSContext';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

export default function PostBookmark({ post, classes = '' }) {
  const { user, setUser, pathname } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const queryClient = useQueryClient();
  const channelRef = useRef(null);
  const { subscribe } = useWS();

  useEffect(() => {
    const unsubscribe = subscribe('bookmark', async () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'posts' && query.queryKey[1]?.startsWith('include='),
      });
    });

    return () => unsubscribe();
  }, [subscribe, queryClient]);

  useEffect(() => {
    channelRef.current = new BroadcastChannel('posts-channel');

    channelRef.current.onmessage = (event) => {
      if (event.data?.type === 'bookmarked') {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'posts',
        });
      }
    };

    return () => {
      channelRef.current.close();
    };
  }, [queryClient, setUser]);

  useEffect(() => {
    console.log(user);
    setIsBookmarked(!!user?.bookmarked_posts?.[post.id]);
  }, [user, post.id]);

  const mutation = useMutation({
    mutationFn: async (isBookmarked) => {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/posts/bookmark/${post.id}/`, { method });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore durante il salvataggio dell'articolo");
      }
      const data = await res.json();
      return { data };
    },
    onMutate: async (isBookmarked) => {
      // Annulla fetch in corso per 'posts'
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot stato precedente
      const prevData = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Ottimistic update
      prevData.forEach(([key, old]) => {
        if (!old) return;
        queryClient.setQueryData(key, {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((p) =>
              isBookmarked && pathname !== '/blog' ? p.id !== post.id : true
            ),
          })),
        });
      });

      // Aggiorna stato locale
      setIsBookmarked(!isBookmarked);
      return { prevData, isBookmarked };
    },
    onSuccess: async (data) => {
      let updatedBookmarkedPosts = {};

      if (!isBookmarked) {
        delete user.bookmarked_posts[data.data.post_id];
        updatedBookmarkedPosts = user.bookmarked_posts;
      } else {
        updatedBookmarkedPosts = {
          ...user.bookmarked_posts,
          [data.data.post_id]: data.data.created_at,
        };
      }

      setUser((prev) => ({
        ...prev,
        bookmarked_posts: updatedBookmarkedPosts,
      }));

      channelRef.current.postMessage({
        type: 'bookmarked',
        bookmarkedPosts: updatedBookmarkedPosts,
      });
    },
    onError: (err, bookmarked, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([key, old]) => {
          queryClient.setQueryData(key, old);
        });
      }
      setIsBookmarked(bookmarked);
      alert(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    if (!user) {
      alert("Devi essere loggato per poter salvare l'articolo");
      return;
    }
    mutation.mutate(isBookmarked); // passiamo lo stato attuale
  };

  /*
  // Versione senza useMutation
  const handleLike = async () => {
    if (!user) {
      alert("Devi essere loggato per poter salvare l'articolo"); // TODO: migliorare con un modal di login
      return;
    }
  
    const bookmardAction = isBookmarked ? "DELETE" : "POST";
    const currentIsBookmarked = isBookmarked;
    setIsBookmarked(!currentIsBookmarked);
  
    try {
      const res = await fetch(`/api/posts/bookmark/${post.id}/`, {
        method: bookmardAction,
      });
  
      if (!res.ok) {
        const error = await res.json();
        setIsBookmarked(currentIsBookmarked);
        alert(error.message || "Errore durante il salvataggio dell'articolo");
        return;
      }
  
      // Aggiornamento ottimistico: rimuovo il post dalle query cached
      queryClient.setQueriesData({ queryKey: ["posts", "bookmarks"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts
              ? page.posts.filter((p) => p.id !== post.id)
              : page.posts,
          })),
        };
      });
  
    } catch (err) {
      setIsBookmarked(currentIsBookmarked);
      alert("Errore di connessione al server");
    }
  };
   */

  return (
    <button
      className={`text-yellow-500 hover:text-yellow-600 z-10 cursor-pointer ${classes}`}
      onClick={handleLike}
      aria-label={isBookmarked ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
    >
      {isBookmarked ? <FaStar size={20} /> : <FaRegStar size={20} />}
    </button>
  );
}
