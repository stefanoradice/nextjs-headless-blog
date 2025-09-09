import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const jwtToken = request.cookies.get('jwtToken')?.value;

  if (!jwtToken) {
    return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(jwtToken, process.env.WP_JWT_AUTH_SECRET_KEY);

    if (!decoded) {
      return NextResponse.json({ message: 'Token non valido o scaduto' }, { status: 401 });
    }

    const res = await fetch(`${process.env.WP_URL}/wp-json/wp/v2/users/${decoded.data.user.id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Errore fetching utente' }, { status: 500 });
    }

    const user = await res.json();
    console.log(user.bookmarked_posts);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: decoded.data.user.email,
        bookmarked_posts: user.bookmarked_posts ?? [] /*  Array.isArray(user.bookmarked_posts)
          ? user.bookmarked_posts.map(Number)
          : user.bookmarked_posts
            ? Object.values(user.bookmarked_posts).map(Number)
            : [] */,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
}
