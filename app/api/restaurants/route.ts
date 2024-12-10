import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface GooglePlacesResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  name: string;
  vicinity: string;
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  user_ratings_total?: number;
}

interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  status: string;
  error_message?: string;
}

const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Zurich': { lat: 47.3769, lng: 8.5417 },
  'Geneva': { lat: 46.2044, lng: 6.1432 },
  'Basel': { lat: 47.5596, lng: 7.5886 },
  'Bern': { lat: 46.9480, lng: 7.4474 },
  'Lausanne': { lat: 46.5197, lng: 6.6323 },
  'Lucerne': { lat: 47.0502, lng: 8.3093 },
  'St. Gallen': { lat: 47.4245, lng: 9.3767 },
  'Winterthur': { lat: 47.5001, lng: 8.7501 },
  'Lugano': { lat: 46.0037, lng: 8.9511 },
  'Neuchâtel': { lat: 46.9920, lng: 6.9311 }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');

  if (!city || !cityCoordinates[city]) {
    return NextResponse.json({ error: 'Invalid city' }, { status: 400 });
  }

  const { lat, lng } = cityCoordinates[city];

  console.log(`Fetching halal restaurants in ${city}`);

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=restaurant&keyword=halal&key=${apiKey}&rankby=prominence&maxresults=60`;

  try {
    const response = await fetch(url);
    const data: GooglePlacesResponse = await response.json();
    console.log('Google Places API response:', data);

    if (data.status === 'OK') {
      const sortedRestaurants = data.results
        .filter(restaurant => (restaurant.rating || 0) >= 4.0 && (restaurant.user_ratings_total || 0) >= 100)
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
        })
        .slice(0, 20);

      console.log(`Returning top rated halal restaurants in ${city}`);
      return NextResponse.json(sortedRestaurants);
    } else if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ message: `No halal restaurants found in ${city}` }, { status: 404 });
    } else {
      console.error('Places API error:', data.status, data.error_message);
      return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

