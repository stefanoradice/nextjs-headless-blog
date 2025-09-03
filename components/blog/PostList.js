'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useCallback } from 'react';
import PostCard from './PostCard';
import { getPostsPaginated } from '@/lib/api/client';
import Skeleton from '../ui/Skeleton';

const fetchPosts = async ({ pageParam = 1, queryKey }) => {
  const [, filterQuery] = queryKey;
  return getPostsPaginated(pageParam, 6, filterQuery);
};

export default function PostList({ filterQuery, bookmarked = false }) {
  const observerRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
    queryKey: ['posts', filterQuery],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  });
  console.log(observerRef);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [loadMore]);

  if (status === 'pending')
    return (
      <ul className="flex flex-row gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </ul>
    );

  if (status === 'error') return <p>Errore: {error.message}</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.pages
          ?.flatMap((page) => page.posts)
          .map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
      </div>
      <div ref={observerRef} className="h-10 mt-6 text-center">
        {isFetchingNextPage && (
          <ul className="flex flex-row h-10 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </ul>
        )}
        {!hasNextPage && <span>Hai raggiunto la fine dei post.</span>}
      </div>
    </>
  );
}
