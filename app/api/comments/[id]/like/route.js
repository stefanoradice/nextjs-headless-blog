export async function POST(request, { params }) {
  try {
    const jwtToken = request.cookies.get('jwtToken')?.value;
    if (!jwtToken) {
      return Response.json({ error: 'Non sei autorizzato' }, { status: 401 });
    }
    const { id } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      return Response.json(
        { error: `Errore interno`, details: err.message },
        { status: err.status }
      );
    }
    return Response.json('Like registrato', { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Errore interno', details: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const jwtToken = request.cookies.get('jwtToken')?.value;
    if (!jwtToken) {
      return Response.json({ error: 'Non sei autorizzato' }, { status: 401 });
    }
    const { id } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/comments/${id}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      return Response.json(
        { error: `Errore interno`, details: err.message },
        { status: err.status }
      );
    }
    return Response.json('Like rimosso', { status: 200 });
  } catch (err) {
    return Response.json({ error: 'Errore interno', details: err.message }, { status: 500 });
  }
}
