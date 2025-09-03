import { NextResponse } from 'next/server';

export async function GET(request) {
  const jwtToken = request.cookies.get('jwtToken')?.value;
  if (!jwtToken) return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wp/v2/settings`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  if (!res.ok) return NextResponse.json({ message: 'Token non valido' }, { status: 401 });

  const settings = await res.json();

  return NextResponse.json(settings);
}
