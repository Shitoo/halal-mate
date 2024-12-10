import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let lat = searchParams.get('lat');
  let lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '5000'; // Default 5km radius

  // Default to a location in Switzerland (e.g., Zurich) if no location is provided
  if (!lat || !lng) {
    lat = '47.3769'; // Zurich latitude
    lng = '8.5417'; // Zurich longitude
  }

  console.log('Fetching restaurants with params:', { lat, lng, radius });

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=halal&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('Google Places API response:', data);

    if (data.status === 'OK') {
      console.log('Returning restaurants:', data.results);
      return NextResponse.json(data.results);
    } else if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ message: 'No restaurants found' }, { status: 404 });
    } else {
      console.error('Places API error:', data.status, data.error_message);
      return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

