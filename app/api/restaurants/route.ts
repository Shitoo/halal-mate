import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city) {
    return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
  }

  try {
    const result = await sql`
      SELECT * FROM restaurants
      WHERE city = ${city}
        AND rating >= 4.0
        AND user_ratings_total >= 100
      ORDER BY rating DESC, user_ratings_total DESC
      LIMIT 20
    `;

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

