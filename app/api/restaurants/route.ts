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
    console.log('Fetching restaurants for city:', city);
    
    const result = await sql.query(`
      SELECT * FROM restaurants
      WHERE city = $1
        AND rating >= 4.0
        AND user_ratings_total >= 100
      ORDER BY rating DESC, user_ratings_total DESC
      LIMIT 20
    `, [city]);

    console.log('Query executed successfully');
    console.log('Results found:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('No restaurants found for city:', city);
      return NextResponse.json({ 
        message: 'No restaurants found',
        city: city,
        results: []
      });
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch restaurants',
      details: errorMessage,
      city: city
    }, { status: 500 });
  }
}

