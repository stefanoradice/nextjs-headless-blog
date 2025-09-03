export async function fetchMenuBySlug(slug = 'main-menu') {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/menus/v1/menus/${slug}`);
    if (!res.ok) throw new Error('Errore nel fetch del menu');
    const json = await res.json();
    const resSettings = await fetch('/api/settings');
    const settings = await resSettings.json();

    return json.items.map((item) => {
      const pageId = item.object_id;
      const isHome = pageId === settings.page_on_front;
      return {
        title: item.title,
        href: isHome ? '/' : item.url.replace(`${process.env.NEXT_PUBLIC_API_URL}`, ''),
      };
    });
  } catch (error) {
    console.error('Errore caricamento menu:', error.message);
    return null;
  }
}
