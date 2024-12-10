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
  next_page_token?: string;
  error_message?: string;
}

const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Zurich': { lat: 47.3769, lng: 8.5417 },
  'Geneva': { lat: 46.2044, lng: 6.1432 },
  'Lausanne': { lat: 46.5197, lng: 6.6323 },
  'Neuchâtel': { lat: 46.9920, lng: 6.9311 },
  'Fribourg': { lat: 46.8065, lng: 7.1615 },
  'Basel': { lat: 47.5596, lng: 7.5886 },
  'Bern': { lat: 46.9480, lng: 7.4474 },
  'Lucerne': { lat: 47.0502, lng: 8.3093 },
  'St. Gallen': { lat: 47.4245, lng: 9.3767 },
  'Winterthur': { lat: 47.5001, lng: 8.7501 },
  'Lugano': { lat: 46.0037, lng: 8.9511 }
};

async function fetchRestaurants(url: string): Promise<GooglePlacesResult[]> {
  const response = await fetch(url);
  const data: GooglePlacesResponse = await response.json();

  if (data.status !== 'OK') {
    console.error('Places API error:', data.status, data.error_message);
    return [];
  }

  let results = data.results;

  // If there's a next_page_token, fetch the next page
  if (data.next_page_token) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before making the next request
    const nextPageUrl = `${url}&pagetoken=${data.next_page_token}`;
    const nextPageResults = await fetchRestaurants(nextPageUrl);
    results = results.concat(nextPageResults);
  }

  return results;
}

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

  const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&keyword=halal&key=${apiKey}&rankby=prominence`;

  try {
    const radii = [1000, 5000, 10000, 20000]; // Search radii in meters
    let allResults: GooglePlacesResult[] = [];

    for (const radius of radii) {
      const url = `${baseUrl}&radius=${radius}`;
      const results = await fetchRestaurants(url);
      allResults = allResults.concat(results);
    }

    // Remove duplicates based on place_id
    const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());

    // Filter and sort results
    const sortedRestaurants = uniqueResults
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
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

