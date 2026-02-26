'use client';
import { useAuth } from '@/context/AuthContext';
import { /* useQueryClient, */ useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

let channel;
function getPostsChannel() {
  if (!channel) {
    channel = new BroadcastChannel('posts-channel');
  }
  return channel;
}

export default function PostBookmark({ post, classes = '' }) {
  const { user, setUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  //const queryClient = useQueryClient();
  const channel = getPostsChannel();

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'bookmarked') {
        setUser(event.data.user);
      }
    };

    channel.addEventListener('message', handler);

    return () => {
      //   channel.removeEventListener('message', handler); // verifica perchè la cleanup interrompe la ricezione dei messaggi all'ultimo post rimosso dai bookmark
    };
  }, [channel]);

  useEffect(() => {
    setIsBookmarked(!!user?.bookmarked_posts?.[post.id]);
    console.log(user);
  }, [user, post.id]);

  const mutation = useMutation({
    mutationFn: async (isBookmarked) => {
      const method = isBookmarked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/posts/bookmark/${post.id}/`, { method });

      if (res.status === 401) {
        setUser(null);
        throw new Error('Sessione scaduta. Effettua nuovamente il login.');
      }
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Errore durante il salvataggio dell'articolo");
      }
      const data = await res.json();
      return { data };
    },
    onMutate: async (isBookmarked) => {
      // snapshot dello user corrente per rollback
      const prevUser = { ...user };

      // Aggiorna stato locale
      setIsBookmarked(!isBookmarked);

      // ritorniamo prevUser per poter fare rollback in caso di errore
      return { prevUser, isBookmarked };
    },
    onSuccess: async (res) => {
      const data = res.data;
      let updatedBookmarkedPosts;

      if (!isBookmarked) {
        delete user.bookmarked_posts[data.post_id];
        updatedBookmarkedPosts = user.bookmarked_posts ?? {};
      } else {
        updatedBookmarkedPosts = {
          ...user.bookmarked_posts,
          [data.post_id]: data.created_at,
        };
      }
      const updatedUser = { ...user, bookmarked_posts: updatedBookmarkedPosts };
      setUser(updatedUser);
      channel.postMessage({
        type: 'bookmarked',
        user: updatedUser,
      });
    },

    onError: (err, isBookmarked, context) => {
      // rollback dello user precedente
      if (context?.prevUser) {
        setUser(context.prevUser);
      }
      // rollback dello stato locale
      setIsBookmarked(context?.isBookmarked);

      alert(err.message);
    },
  });

  const handleLike = () => {
    if (!user) {
      alert("Devi essere loggato per poter salvare l'articolo");
      return;
    }
    mutation.mutate(isBookmarked);
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
