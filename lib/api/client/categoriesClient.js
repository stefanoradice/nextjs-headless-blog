export async function getAllCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/categories?per_page=100`);
    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
}
