import { getAllPages, getPageBySlug } from '@/lib/api/client';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const data = await getAllPages();

    return data.pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Errore durante la generazione dei parametri statici:', error);
    return [];
  }
}

export default async function DynamicPage({ params }) {
  const { slug } = params;
  const data = await getPageBySlug(slug);
  if (!data) {
    return notFound();
  }
  return <div dangerouslySetInnerHTML={{ __html: data?.content?.rendered }}></div>;
}
