export async function GET(req, { params }) {
  try {
    const jwtToken = req.cookies.get('jwtToken')?.value;

    if (!jwtToken) {
      return Response.json({ error: 'Non sei autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range');
    const type = searchParams.get('type');
    if (!range) {
      return Response.json({ error: 'Paramentro "Range" mancante ' }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/metrics/${type}?range=${range}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return Response.json(
        { error: `Errore interno`, details: err.message },
        { status: err.status }
      );
    }

    const data = await res.json();

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Errore interno', details: err.message }, { status: 500 });
  }
}
