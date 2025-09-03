import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function fetchPostsByUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwtToken')?.value;

  if (!token) return [];

  const decoded = jwt.decode(token);
  const userId = decoded?.data?.user?.id;

  if (!userId) return [];

  const res = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/comments?author=${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Errore nel caricamento dei commenti');

  return res.json();
}
