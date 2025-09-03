export async function getAllCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/categories?per_page=100`);
  return await res.json();
}
