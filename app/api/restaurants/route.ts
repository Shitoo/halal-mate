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
  next_page_token?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageToken = searchParams.get('pageToken');

  // Define a bounding box for Switzerland
  const switzerlandBounds = {
    south: 45.8179,
    west: 5.9559,
    north: 47.8084,
    east: 10.4923
  };

  // Use the center of Switzerland as the default location
  const defaultLat = (switzerlandBounds.north + switzerlandBounds.south) / 2;
  const defaultLng = (switzerlandBounds.east + switzerlandBounds.west) / 2;

  console.log('Fetching restaurants within Switzerland');

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${defaultLat},${defaultLng}&radius=50000&type=restaurant&keyword=halal&key=${apiKey}&bounds=${switzerlandBounds.south},${switzerlandBounds.west}|${switzerlandBounds.north},${switzerlandBounds.east}`;

  if (pageToken) {
    url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${pageToken}&key=${apiKey}`;
  }

  try {
    const response = await fetch(url);
    const data: GooglePlacesResponse = await response.json();
    console.log('Google Places API response:', data);

    if (data.status === 'OK') {
      // Filter results to ensure they are within Switzerland
      const switzerlandRestaurants = data.results.filter((restaurant: GooglePlacesResult) => {
        const lat = restaurant.geometry.location.lat;
        const lng = restaurant.geometry.location.lng;
        return lat >= switzerlandBounds.south && lat <= switzerlandBounds.north &&
               lng >= switzerlandBounds.west && lng <= switzerlandBounds.east;
      });
      console.log('Returning restaurants in Switzerland:', switzerlandRestaurants);
      return NextResponse.json({
        restaurants: switzerlandRestaurants,
        nextPageToken: data.next_page_token
      });
    } else if (data.status === 'ZERO_RESULTS') {
      return NextResponse.json({ message: 'No halal restaurants found in Switzerland' }, { status: 404 });
    } else {
      console.error('Places API error:', data.status, data.error_message);
      return NextResponse.json({ error: 'Failed to fetch restaurants' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}

