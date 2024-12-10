interface PlacesApiResponse {
    status: string;
    results: any[];
    error_message?: string;
    next_page_token?: string;
  }
  
  import { sql } from '@vercel/postgres';
  import fetch from 'node-fetch';
  
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
  
  async function fetchRestaurants(url: string): Promise<any[]> {
    const response = await fetch(url);
    const data = await response.json() as PlacesApiResponse;
  
    if (data.status !== 'OK') {
      console.error('Places API error:', data.status, data.error_message);
      return [];
    }
  
    let results = data.results;
  
    if (data.next_page_token) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const nextPageUrl = `${url}&pagetoken=${data.next_page_token}`;
      const nextPageResults = await fetchRestaurants(nextPageUrl);
      results = results.concat(nextPageResults);
    }
  
    return results;
  }
  
  export async function updateRestaurants() {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('API key is not configured');
      return;
    }
  
    for (const [city, coordinates] of Object.entries(cityCoordinates)) {
      console.log(`Updating restaurants for ${city}`);
      const { lat, lng } = coordinates;
      const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&keyword=halal&key=${apiKey}&rankby=prominence`;
  
      const radii = [1000, 5000, 10000, 20000];
      let allResults: any[] = [];
  
      for (const radius of radii) {
        const url = `${baseUrl}&radius=${radius}`;
        const results = await fetchRestaurants(url);
        allResults = allResults.concat(results);
      }
  
      const uniqueResults = Array.from(new Map(allResults.map(item => [item.place_id, item])).values());
  
      for (const restaurant of uniqueResults) {
        await sql`
          INSERT INTO restaurants (place_id, name, vicinity, lat, lng, rating, user_ratings_total, city)
          VALUES (${restaurant.place_id}, ${restaurant.name}, ${restaurant.vicinity}, 
                  ${restaurant.geometry.location.lat}, ${restaurant.geometry.location.lng}, 
                  ${restaurant.rating}, ${restaurant.user_ratings_total}, ${city})
          ON CONFLICT (place_id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            vicinity = EXCLUDED.vicinity,
            lat = EXCLUDED.lat,
            lng = EXCLUDED.lng,
            rating = EXCLUDED.rating,
            user_ratings_total = EXCLUDED.user_ratings_total,
            updated_at = CURRENT_TIMESTAMP
        `;
      }
    }
  
    console.log('Restaurant data update completed');
  }
  
  