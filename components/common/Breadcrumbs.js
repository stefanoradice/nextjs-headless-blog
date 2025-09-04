import Link from 'next/link';

export default async function Breadcrumbs({ post }) {
  return (
    <nav className="breadcrumbs">
      <Link href="/">Home</Link> /<Link href="/blog/">Blog</Link> /
      <span>{post.title.rendered}</span>
    </nav>
  );
}
