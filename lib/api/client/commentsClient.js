export async function fetchCommentsByPostId(postId, parentId = 0, perPage = 100, page = 1) {
  const res = await fetch(
    `/api/comments?post=${postId}&parent=${parentId}&per_page=${perPage}&page=${page}`
  );
  if (!res.ok) throw new Error('Errore nel recupero dei commenti');

  return await res.json();
}

export async function fetchCommentById(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/comments/${id}`);
  if (!res.ok) throw new Error('Commento non trovato');
  return res.json();
}
