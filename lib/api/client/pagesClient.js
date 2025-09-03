export async function getAllPages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/pages`);
  if (!res.ok) throw new Error('Errore nel recupero delle pagine');
  const data = await res.json();
  return data;
}
export async function getPageBySlug(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/pages/?slug=${slug}`);
  if (!res.ok) throw new Error('Errore nel recupero della pagina');
  const data = await res.json();
  return data[0];
}
