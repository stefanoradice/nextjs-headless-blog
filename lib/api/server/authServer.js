import jwt from 'jsonwebtoken';

export async function getToken() {
  const url = process.env.WP_URL + '/wp-json/jwt-auth/v1/token';

  if (!process.env.WP_JWT_USER || !process.env.WP_JWT_PASSWORD) {
    throw new Error('Credenziali WordPress mancanti');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: process.env.WP_JWT_USER,
      password: process.env.WP_JWT_PASSWORD,
    }),
    next: { revalidate: 300 }, // 300 secondi = 5 minuti di cache
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Errore HTTP! Status: ${res.status} - ${text}`);
  }

  const data = await res.json();

  if (!data.token) {
    throw new Error('Token non trovato nella risposta');
  }

  return data.token;
}

export async function verifyUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.WP_JWT_AUTH_SECRET_KEY);
    return {
      id: decoded.data.user.id,
      email: decoded.data.user.email,
      name: decoded.data.user.displayName,
    };
  } catch (err) {
    return null;
  }
}
