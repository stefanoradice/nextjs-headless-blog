export async function getAllTags() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/tags?per_page=100`);
  return await res.json();
}
