import { RestaurantList } from '@/components/RestaurantList'
import { DiscoverSection } from '@/components/DiscoverSection'
import { HowItWorks } from '@/components/HowItWorks'
import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Hero 
        title="Discover Halal Restaurants in Switzerland with Halal Mate"
        subtitle={<>Discover top-rated Halal restaurants <br className="hidden sm:inline" /> across major Swiss cities.</>}
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section id="halal-restaurants-switzerland" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-black">Top-Rated Halal Restaurants in Swiss Cities</h2>
          <RestaurantList />
        </section>

        <DiscoverSection />
        <HowItWorks />
      </div>
    </div>
  )
}

