'use client'

import { useState, useEffect } from 'react'
import { RestaurantCard } from '@/components/RestaurantCard'
import { NearbyRestaurants } from '@/components/NearbyRestaurants'
import { PaginationControls } from '@/components/Pagination'
import { DiscoverSection } from '@/components/DiscoverSection'
import { HowItWorks } from '@/components/HowItWorks'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CantonsList } from '@/components/CantonsList'
import { Hero } from '@/components/Hero'
import { StructuredData } from '@/components/StructuredData'

const RESTAURANTS_PER_PAGE = 12;

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const location = JSON.parse(savedLocation);
      setUserLocation(location);
      fetchRestaurants(location.lat, location.lng);
    }
  }, []);

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    fetchRestaurants(location.lat, location.lng);
  };

  const fetchRestaurants = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
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

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.vicinity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRestaurants.length / RESTAURANTS_PER_PAGE);
  const startIndex = (currentPage - 1) * RESTAURANTS_PER_PAGE;
  const endIndex = startIndex + RESTAURANTS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <StructuredData restaurants={restaurants} />
      <div className="bg-white flex flex-col min-h-screen">
        <Hero 
          title="Discover Halal Restaurants in Switzerland with Halal Mate"
          subtitle={<>Your trusted companion for finding <br className="hidden sm:inline" /> Halal restaurants across Switzerland.</>}
        />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <section id="nearby-halal-spots" className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black">Nearby Halal Restaurants</h2>
            <NearbyRestaurants 
              restaurants={restaurants} 
              userLocation={userLocation} 
              onLocationUpdate={handleLocationUpdate}
              isLoading={isLoading}
              error={error}
            />
          </section>

          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black">All Halal Mate Listings</h2>
            <div className="mb-4">
              <Label htmlFor="search" className="text-gray-700">Search restaurants or locations</Label>
              <Input
                id="search"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 w-full max-w-md"
              />
            </div>
            {isLoading ? (
              <p>Loading restaurants...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {currentRestaurants.map((restaurant) => (
                    <RestaurantCard 
                      key={restaurant.place_id} 
                      restaurant={restaurant} 
                      userLocation={userLocation}
                    />
                  ))}
                </div>
                <PaginationControls 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </>
            )}
          </section>

          <DiscoverSection />
          <HowItWorks />
          <CantonsList currentCanton={null} />
        </div>
      </div>
    </>
  )
}

