import { Search, MapPin, Utensils } from 'lucide-react'

export function HowItWorks() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          How Halal Mate Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Browse Halal Restaurants</h3>
            <p className="text-gray-600">
              Explore our curated selection of authentic halal restaurants across Switzerland
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Nearby Restaurants</h3>
            <p className="text-gray-600">
              Discover the closest halal restaurants to you with real-time distance information
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-black bg-opacity-10 rounded-full flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy Your Halal Food</h3>
            <p className="text-gray-600">
              Visit the restaurant with confidence knowing it&apos;s 100% halal certified
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

