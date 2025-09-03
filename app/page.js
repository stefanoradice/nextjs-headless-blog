import BlogPage from './blog/page';

export default function Home({ searchParams }) {
  return (
    <>
      <BlogPage searchParams={searchParams} />
    </>
  );
}
