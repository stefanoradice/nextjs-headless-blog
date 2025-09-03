import { z } from 'zod';

const commentSchema = z.object({
  post: z.number(),
  /*   
  author_name: z.string().min(2, 'Nome troppo corto'),
  author_email: z.string().email('Email non valida'),
   */
  content: z.string().min(1, 'Il contenuto è obbligatorio'),
  parent: z.number().optional(),
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('post');
  const parentId = searchParams.get('parent');
  const perPage = searchParams.get('per_page');
  const page = searchParams.get('page');

  /*   
  if (!postId) {
      return Response.json({ error: 'Parametro "post" mancante' }, { status: 400 });
    } 
  */

  try {
    const params = new URLSearchParams();

    if (postId) params.append('post', postId);
    if (parentId) params.append('parent', parentId);
    if (perPage) params.append('per_page', perPage);
    if (page) params.append('page', page);

    const queryString = params.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wp/v2/comments${queryString ? `?${queryString}` : ''}`
    );

    if (!res.ok) {
      return Response.json({ error: 'Errore nella richiesta a WordPress' }, { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Total': res.headers.get('X-WP-Total') || '0',
      },
    });
  } catch (error) {
    return Response.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const jwtToken = req.cookies.get('jwtToken')?.value;
    const parsed = commentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Dati non validi', issues: parsed.error.format() },
        { status: 400 }
      );
    }

    const { post, author_name, author_email, content, parent } = parsed.data;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        post,
        author_name,
        author_email,
        content,
        ...(parent ? { parent } : {}),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: 'Errore da WordPress', details: data }, { status: res.status });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Errore interno', details: err.message }, { status: 500 });
  }
}
