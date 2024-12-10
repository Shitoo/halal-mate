'use client'

import { useState, useEffect } from 'react'
import { NearbyRestaurants } from '@/components/NearbyRestaurants'
import { DiscoverSection } from '@/components/DiscoverSection'
import { HowItWorks } from '@/components/HowItWorks'
import { CantonsList } from '@/components/CantonsList'
import { Hero } from '@/components/Hero'

export default function Home() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, []);

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Hero 
        title="Discover Halal Restaurants in Switzerland with Halal Mate"
        subtitle={<>Your trusted companion for finding <br className="hidden sm:inline" /> Halal restaurants across Switzerland.</>}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section id="nearby-halal-spots" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black">Halal Restaurants in Switzerland</h2>
          <NearbyRestaurants 
            userLocation={userLocation} 
            onLocationUpdate={handleLocationUpdate}
          />
        </section>

        <DiscoverSection />
        <HowItWorks />
        <CantonsList currentCanton={null} />
      </div>
    </div>
  )
}

