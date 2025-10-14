'use client';

import PostList from '@/components/blog/PostList';
import { useAuth } from '@/context/AuthContext';

export default function BookmarkedPage() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;
  const filterQuery = Object.keys(user.bookmarked_posts).length
    ? `include=${Object.keys(user.bookmarked_posts).join(',')}`
    : `include=0`;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">I miei articoli salvati</h1>
      {user.bookmarked_posts ? (
        <PostList filterQuery={filterQuery} bookmarked={true} />
      ) : (
        'Nessun articolo salvato'
      )}
    </div>
  );
}
