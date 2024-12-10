'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from '@/components/RestaurantCard'
import { LocationServices } from '@/components/LocationServices'

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

interface NearbyRestaurantsProps {
  userLocation: { lat: number; lng: number } | null;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

export function NearbyRestaurants({ userLocation, onLocationUpdate }: NearbyRestaurantsProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, [userLocation]);

  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = userLocation
        ? `/api/restaurants?lat=${userLocation.lat}&lng=${userLocation.lng}`
        : '/api/restaurants';
      const response = await fetch(url);
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
      <LocationServices onLocationUpdate={onLocationUpdate} />
      {isLoading && <p>Loading restaurants...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && restaurants.length === 0 && (
        <p>No restaurants found. Try adjusting your location or search radius.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id} restaurant={restaurant} userLocation={userLocation} />
        ))}
      </div>
    </div>
  );
}

