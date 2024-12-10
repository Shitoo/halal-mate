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
    const result = await sql.query(`
      SELECT * FROM restaurants
      WHERE city = $1
        AND rating >= 4.0
        AND user_ratings_total >= 100
      ORDER BY rating DESC, user_ratings_total DESC
      LIMIT 20
    `, [city]);

    console.log('SQL query executed successfully');
    console.log('Number of results:', result.rows.length);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: 'An error occurred', details: errorMessage }, { status: 500 });
  }
}

