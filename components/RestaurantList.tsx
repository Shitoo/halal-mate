'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from '@/components/RestaurantCard'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaginationControls } from '@/components/Pagination'
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

const RESTAURANTS_PER_PAGE = 12;

export function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const filtered = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.vicinity.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchTerm, restaurants]);

  const fetchRestaurants = async (pageToken?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = pageToken ? `/api/restaurants?pageToken=${pageToken}` : '/api/restaurants';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (pageToken) {
          setRestaurants(prevRestaurants => [...prevRestaurants, ...data.restaurants]);
        } else {
          setRestaurants(data.restaurants);
        }
        setNextPageToken(data.nextPageToken);
      } else {
        throw new Error('Failed to fetch restaurants');
      }
    } catch (error) {
      setError('Failed to fetch restaurants. Please try again later.');
      console.error('Failed to fetch restaurants:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const loadMoreRestaurants = () => {
    if (nextPageToken) {
      setIsLoadingMore(true);
      fetchRestaurants(nextPageToken);
    }
  };

  const totalPages = Math.ceil(filteredRestaurants.length / RESTAURANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const endIndex = startIndex + RESTAURANTS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Label htmlFor="search" className="text-gray-700">Search restaurants, cities, or cantons</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1 w-full max-w-md"
        />
      </div>
      {isLoading && <p>Loading halal restaurants in Switzerland...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && filteredRestaurants.length === 0 && (
        <p>No halal restaurants found matching your search. Please try a different term.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
        ))}
      </div>
      {totalPages > 1 && (
        <PaginationControls 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
      {nextPageToken && (
        <div className="flex justify-center mt-4">
          <Button onClick={loadMoreRestaurants} disabled={isLoadingMore}>
            {isLoadingMore ? 'Loading...' : 'Load More Restaurants'}
          </Button>
        </div>
      )}
    </div>
  );
}

