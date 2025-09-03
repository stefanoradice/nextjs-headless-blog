export async function DELETE(req, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Parametro "id" mancante' }, { status: 400 });
  }

  const jwtToken = req.cookies.get('jwtToken')?.value;

  if (!jwtToken) {
    return Response.json({ error: 'Non sei autenticato' }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: 'Errore da WordPress', details: data }, { status: res.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: 'Parametro "id" mancante' }, { status: 400 });
  }

  const jwtToken = req.cookies.get('jwtToken')?.value;

  if (!jwtToken) {
    return Response.json({ error: 'Non sei autenticato' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return Response.json({ error: 'Il campo "content" è obbligatorio' }, { status: 400 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: 'Errore da WordPress', details: data }, { status: res.status });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
