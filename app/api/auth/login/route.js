import { NextResponse } from 'next/server';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  username: z.string().min(1, 'Il nome utente è obbligatorio'),
  password: z.string().min(1, 'La password è obbligatoria'),
});

export async function POST(req) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: 'Dati non validi', errors }, { status: 400 });
    }
    const { username, password } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || 'Non sei autorizzato' },
        { status: 401 }
      );
    }

    const data = await res.json();
    /* data contains:
        token
        user_display_name
        user_email
        user_nicename
        */

    const decoded = jwt.verify(data.token, process.env.WP_JWT_AUTH_SECRET_KEY);

    if (!decoded) {
      return NextResponse.json({ error: 'Token non valido o scaduto' }, { status: 401 });
    }

    const resUser = await fetch(
      `${process.env.WP_URL}/wp-json/wp/v2/users/${decoded.data.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );

    if (!resUser.ok) {
      return NextResponse.json({ message: 'Errore fetching utente' }, { status: 500 });
    }

    const user = await resUser.json();

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: decoded.data.user.email,
        bookmarked_posts: Array.isArray(user.bookmarked_posts)
          ? user.bookmarked_posts.map(Number)
          : user.bookmarked_posts
            ? Object.values(user.bookmarked_posts).map(Number)
            : [],
      },
    });

    response.cookies.set('jwtToken', data.token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err.message || 'Errore interno del server' },
      { status: 500 }
    );
  }
}
