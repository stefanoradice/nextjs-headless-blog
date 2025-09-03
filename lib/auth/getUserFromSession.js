import { cookies } from 'next/headers';

export default async function getUserFromSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString(); // converte tutti i cookie in formato header

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}
