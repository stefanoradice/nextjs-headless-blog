import Image from 'next/image';
import Link from 'next/link';
import PostBookmark from './PostBookmark';
import React, { startTransition } from 'react';
import { useRouter } from 'next/navigation';

export default React.memo(function PostCard({ post }) {
  const maxLength = 30;
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/no-image.svg';
  const excerptText = post.excerpt?.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160);
  const trimmed =
    excerptText.length > maxLength ? excerptText.slice(0, maxLength) + '[...]' : excerptText;

  const router = useRouter();

  function handleClick(e) {
    e.preventDefault();
    startTransition(() => {
      router.push(`/blog/${post.slug}`);
    });
  }

  return (
    <article className="post-card relative h-full">
      <PostBookmark post={post} classes="absolute bottom-2 right-2" />
      <Link href={`/blog/${post.slug}`} onClick={handleClick} className="block">
        {imageUrl && (
          <div className="image-container relative w-full h-48">
            <Image
              src={imageUrl}
              alt={post.title.rendered}
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
            />
          </div>
        )}
        <div className="content p-4">
          <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <p>{trimmed}</p>
        </div>
      </Link>
    </article>
  );
});
