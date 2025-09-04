'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect, useCallback, useMemo } from 'react';
import PostCard from './PostCard';
import { getPostsPaginated } from '@/lib/api/client';
import Skeleton from '../ui/Skeleton';
import SkeletonWrapper from '../ui/SkeletonWrapper';

const fetchPosts = async ({ pageParam = 1, queryKey }) => {
  const [, filterQuery] = queryKey;
  return getPostsPaginated(pageParam, 6, filterQuery);
};

export default function PostList({ filterQuery }) {
  const observerRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error, refetch } =
    useInfiniteQuery({
      queryKey: ['posts', filterQuery],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
      },
      retry: 1,
      staleTime: 60_000,
      onError: (err) => console.error('Errore fetch posts:', err),
    });

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) || [], [data?.pages]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );

    observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
      observer.disconnect();
    };
  }, [loadMore]);

  if (status === 'loading')
    return (
      <ul className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} />
        ))}
      </ul>
    );

  if (status === 'error')
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-2">
          Errore nel caricamento dei post: {error?.message || 'Qualcosa è andato storto'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Riprova
        </button>
      </div>
    );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {posts.map((post) => (
          <SkeletonWrapper key={post.id} skeleton={<Skeleton />}>
            <PostCard post={post} />
          </SkeletonWrapper>
        ))}
      </div>

      <div ref={observerRef} aria-busy={isFetchingNextPage} className="h-10 mt-6 text-center">
        {isFetchingNextPage && (
          <ul className="flex flex-row h-10 gap-3 justify-center">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} />
            ))}
          </ul>
        )}
        {!hasNextPage && posts.length > 0 && <span>Hai raggiunto la fine dei post.</span>}
      </div>
    </>
  );
}
