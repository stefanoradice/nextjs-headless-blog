import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || 1;
  const perPage = searchParams.get('per_page') || 6;
  const filters =
    req.url
      .split('?')[1]
      ?.split('&')
      .filter((f) => !f.startsWith('page') && !f.startsWith('per_page'))
      .join('&') || '';

  const url = `${process.env.NEXT_PUBLIC_API_URL}/wp/v2/posts?page=${page}&per_page=${perPage}&${filters}&_embed`;
  const res = await fetch(url);
  const data = await res.json();
  const totalPages = parseInt(res.headers.get('x-wp-totalpages'), 10);

  return NextResponse.json({ posts: data, totalPages });
}
