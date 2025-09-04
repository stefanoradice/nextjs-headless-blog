import { getAllCategories, getAllTags } from '@/lib/api/client';
import Sidebar from '@/components/layout/Sidebar';
import PostList from '@/components/blog/PostList';
import Skeleton from '@/components/ui/Skeleton';
import { Suspense } from 'react';

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const catFilter = resolvedSearchParams?.categories?.split(',') || [];
  const tagFilter = resolvedSearchParams?.tags?.split(',') || [];

  const filters = [];
  if (catFilter.length) filters.push(`categories=${catFilter.join(',')}`);
  if (tagFilter.length) filters.push(`tags=${tagFilter.join(',')}`);

  const filterQuery = filters.length ? `&${filters.join('&')}` : '';

  const categories = await getAllCategories();
  const tags = await getAllTags();

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Archivio Blog</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Sidebar categories={categories} tags={tags} />
        </aside>

        <section className="lg:col-span-3">
          <PostList filterQuery={filterQuery} />
        </section>
      </div>
    </>
  );
}
