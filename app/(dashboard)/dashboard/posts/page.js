'use client';

import PostList from '@/components/blog/PostList';
import { useAuth } from '@/context/AuthContext';

export default function BookmarkedPage() {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  const filterQuery = `include=${user.bookmarked_posts.join(',')}`;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">I miei articoli salvati</h1>
      <PostList filterQuery={filterQuery} bookmarked={true} />
    </div>
  );
}
