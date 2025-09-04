import Breadcrumbs from '@/components/common/Breadcrumbs';
import { getPostsPaginated, getPostBySlug } from '@/lib/api/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Comments from '@/components/features/comments/Comments';
import PostBookmark from '@/components/blog/PostBookmark';

export async function generateStaticParams() {
  try {
    const data = await getPostsPaginated();

    return data.posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Errore durante la generazione dei parametri statici:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Articolo non trovato',
    };
  }
  const plainTitle = post.title.rendered;
  const plainExcerpt =
    post.excerpt?.rendered?.replace(/<[^>]+>/g, '').slice(0, 160) || "Leggi l'articolo completo";

  return {
    title: plainTitle,
    description: plainExcerpt,
    openGraph: {
      title: plainTitle,
      description: plainExcerpt,
      url: `http://localhost:3000/blog/${slug}`, // oppure dominio in produzione
      siteName: post.yoast_head_json?.og_site_name,
      locale: 'it_IT',
      type: 'article',
      images: [
        {
          url:
            post.yoast_head_json?.og_image?.[0]?.url ||
            'https://via.placeholder.com/1200x630.png?text=Articolo', // fallback se non hai immagini
          width: 1200,
          height: 630,
          alt: plainTitle,
        },
      ],
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const coverImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (!post) {
    notFound();
  }
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumbs post={post} />

      <h1
        className="text-4xl font-bold leading-tight mb-4"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      <div className="flex justify-between text-sm text-gray-500 mb-6">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        <PostBookmark post={post} />
      </div>

      {coverImage && (
        <div className="mb-6">
          <Image
            src={coverImage}
            alt={post.title.rendered}
            width={800}
            height={400}
            className="rounded-lg object-cover w-full h-auto"
            priority
          />
        </div>
      )}

      <article
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
      <Comments post={post} />
    </main>
  );
}
