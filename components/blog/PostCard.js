import Image from 'next/image';
import Link from 'next/link';
import PostBookmark from './PostBookmark';

export default function PostCard({ post }) {
  const maxLength = 30;
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '../../no-image.svg';
  const excerptText = post.excerpt?.rendered.replace(/<[^>]*>?/gm, '').slice(0, 160);
  const trimmed =
    excerptText.length > maxLength ? excerptText.slice(0, maxLength) + '[...]' : excerptText;
  return (
    <article className="post-card relative">
      <PostBookmark
        post={post}
        classes="absolute bottom-2 right-2 text-yellow-500 hover:text-yellow-600 z-index-1 cursor-pointer"
      />
      <Link href={`/blog/${post.slug}`}>
        <div className="image-container">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.title.rendered}
              fill
              style={{ objectFit: 'cover' }}
              priority={true} // opzionale, per caricare subito l'immagine
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
        <div className="content">
          <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <div>{trimmed}</div>
        </div>
      </Link>
    </article>
  );
}
