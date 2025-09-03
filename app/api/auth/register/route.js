import { NextResponse } from 'next/server';
import { getToken } from '@/lib/api/server/authServer';
import { success } from 'zod';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'username, email e password sono richiesti' },
        { status: 400 }
      );
    }

    const token = await getToken();

    const res = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) {
      let errorMessage = 'Errore sconosciuto';
      try {
        const errorData = await res.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = await res.text();
      }
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Errore interno del server' },
      { status: 500 }
    );
  }
}
