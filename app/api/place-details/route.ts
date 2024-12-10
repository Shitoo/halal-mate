import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,opening_hours&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return NextResponse.json({
        rating: data.result.rating,
        userRatingsTotal: data.result.user_ratings_total,
        openingHours: data.result.opening_hours
      });
    } else {
      return NextResponse.json({ error: 'Failed to fetch place details' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

