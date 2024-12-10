'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from '@/components/RestaurantCard'
import { Button } from "@/components/ui/button"

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
  opening_hours?: {
    open_now: boolean;
  };
  rating?: number;
  user_ratings_total?: number;
}

const cities = ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lausanne', 'Lucerne', 'St. Gallen', 'Winterthur', 'Lugano', 'Neuchâtel'];

export function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCity) {
      fetchRestaurants(selectedCity);
    }
  }, [selectedCity]);

  const fetchRestaurants = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/restaurants?city=${encodeURIComponent(city)}`);
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      } else {
        throw new Error('Failed to fetch restaurants');
      }
    } catch (error) {
      setError('Failed to fetch restaurants. Please try again later.');
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {cities.map((city) => (
          <Button
            key={city}
            onClick={() => setSelectedCity(city)}
            variant={selectedCity === city ? "default" : "outline"}
          >
            {city}
          </Button>
        ))}
      </div>
      {isLoading && <p>Loading halal restaurants in {selectedCity}...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && restaurants.length === 0 && selectedCity && (
        <p>No halal restaurants found in {selectedCity}.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

