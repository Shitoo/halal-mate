import Image from "next/image"

export function DiscoverSection() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Discover All Halal Restaurants in Switzerland
            </h2>
            <p className="text-xl text-gray-600">
              Halal Mate helps you find halal restaurants in Switzerland. No more wondering what to eat today, we&apos;ve got you covered!
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/halal-mate-food-restaurants.jpg"
              alt="Delicious Halal Food in Swiss Restaurants"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}

