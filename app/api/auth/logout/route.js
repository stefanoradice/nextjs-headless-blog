import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout effettuato' });
  response.cookies.set('jwtToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  return response;
}
