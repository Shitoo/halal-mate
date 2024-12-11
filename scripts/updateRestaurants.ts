import { sql } from '@vercel/postgres';
import fetch from 'node-fetch';

interface PlacesApiResponse {
  status: string;
  results: any[];
  error_message?: string;
  next_page_token?: string;
}

interface Restaurant {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  user_ratings_total: number;
  score?: number;
}

const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Zurich': { lat: 47.3769, lng: 8.5417 },
  'Geneva': { lat: 46.2044, lng: 6.1432 },
  'Basel': { lat: 47.5596, lng: 7.5886 },
  'Bern': { lat: 46.9480, lng: 7.4474 },
  'Lausanne': { lat: 46.5197, lng: 6.6323 },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isHalalRestaurant(restaurant: any): boolean {
  const name = restaurant.name.toLowerCase();
  const types = restaurant.types || [];
  return name.includes('halal') || types.includes('halal_restaurant');
}

async function fetchRestaurants(url: string, retries = 3): Promise<any[]> {
  console.log(`Fetching halal restaurants from URL: ${url}`);
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    try {
      const data = JSON.parse(text) as PlacesApiResponse;
      
      if (data.status !== 'OK') {
        console.error('Places API error:', data.status, data.error_message);
        return [];
      }

      let results = data.results.filter(isHalalRestaurant);

      if (data.next_page_token) {
        await delay(2000); // Wait 2 seconds before the next request
        const nextPageUrl = `${url}&pagetoken=${data.next_page_token}`;
        const nextPageResults = await fetchRestaurants(nextPageUrl);
        results = results.concat(nextPageResults);
      }

      return results;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Raw response:', text);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        await delay(2000);
        return fetchRestaurants(url, retries - 1);
      }
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await delay(2000);
      return fetchRestaurants(url, retries - 1);
    }
    return [];
  }
}

function getTopRestaurants(restaurants: Restaurant[], limit: number = 10): Restaurant[] {
  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.rating >= 4.5 && restaurant.user_ratings_total >= 100
  );

  const maxReviews = Math.max(...filteredRestaurants.map(r => r.user_ratings_total));

  const scoredRestaurants = filteredRestaurants.map(restaurant => ({
    ...restaurant,
    score: (restaurant.rating * 0.7) + ((restaurant.user_ratings_total / maxReviews) * 0.3)
  }));

  return scoredRestaurants
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.user_ratings_total - a.user_ratings_total;
    })
    .slice(0, limit);
}

export async function updateRestaurants() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('API key is not configured');
    return;
  }

  console.log('Using API key:', apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5));

  for (const [city, coordinates] of Object.entries(cityCoordinates)) {
    console.log(`Updating top halal restaurants for ${city}`);
    const { lat, lng } = coordinates;
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=restaurant&keyword=halal+restaurant&key=${apiKey}&rankby=prominence&radius=10000`;

    try {
      const allResults = await fetchRestaurants(baseUrl);
      console.log(`Found ${allResults.length} halal restaurants in ${city}`);
      const topRestaurants = getTopRestaurants(allResults);
      console.log(`Selected top ${topRestaurants.length} restaurants for ${city} (rating >= 4.5, 100+ reviews)`);

      for (const restaurant of topRestaurants) {
        try {
          await sql`
            INSERT INTO restaurants (place_id, name, vicinity, lat, lng, rating, user_ratings_total, city)
            VALUES (${restaurant.place_id}, ${restaurant.name}, ${restaurant.vicinity}, ${restaurant.geometry.location.lat}, ${restaurant.geometry.location.lng}, ${restaurant.rating}, ${restaurant.user_ratings_total}, ${city})
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
          console.log(`Upserted restaurant: ${restaurant.name}`);
        } catch (error) {
          console.error(`Error inserting/updating restaurant ${restaurant.name}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error fetching restaurants for ${city}:`, error);
    }
  }

  console.log('Top halal restaurant data update completed');
}

