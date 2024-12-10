'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from './RestaurantCard'
import { LocationServices } from './LocationServices'

interface NearbyRestaurantsProps {
  restaurants: any[];
  userLocation: { lat: number; lng: number } | null;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
  isLoading: boolean;
  error: string | null;
}

export function NearbyRestaurants({ restaurants, userLocation, onLocationUpdate, isLoading, error }: NearbyRestaurantsProps) {
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);

  useEffect(() => {
    if (restaurants.length > 0) {
      setNearbyRestaurants(restaurants.slice(0, 10));
    }
  }, [restaurants]);

  if (!userLocation) {
    return <LocationServices onLocationUpdate={onLocationUpdate} />;
  }

  if (isLoading) {
    return <p>Loading nearby restaurants...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-4">
      <LocationServices onLocationUpdate={onLocationUpdate} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {nearbyRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id} restaurant={restaurant} userLocation={userLocation} />
        ))}
      </div>
    </div>
  );
}

