export async function getPostsPaginated(page = 1, perPage = 10, filterQuery) {
  const query = filterQuery
    ? `${filterQuery.startsWith('&') ? filterQuery : '&' + filterQuery}`
    : '';

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wp/v2/posts?page=${page}&per_page=${perPage}${query}&_embed`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) throw new Error('Errore nel recupero dei post');

  const totalPosts = res.headers.get('x-wp-total');
  const totalPages = res.headers.get('x-wp-totalpages');
  const posts = await res.json();
  //await new Promise(resolve => setTimeout(resolve,5000)) //delay forzato per debu skeleton
  return {
    posts,
    totalPages: parseInt(totalPages, 10),
    totalPosts: parseInt(totalPosts, 10),
  };
}

export async function getPostBySlug(slug) {
  //throw new Errror('Errore Simulato!') //simula errore
  //await new Promise(resolve => setTimeout(resolve, 3000)) //simula caricamento lento pagina con una Promise che torna un setTimeout di 3s prima di risolversi

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/posts?slug=${slug}&_embed`, {
    next: { revalidate: 60 }, // caching ISR
  });
  if (!res.ok) throw new Error('Errore fetch post');

  const posts = await res.json();
  return !posts.length ? null : posts[0];
}

export async function getPostById(post_id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/posts/${post_id}?_embed`, {
    next: { revalidate: 60 }, // caching ISR
  });

  if (!res.ok) throw new Error('Errore fetch post by ID');

  const post = await res.json();
  return post;
}
