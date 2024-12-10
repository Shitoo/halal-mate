import { notFound } from 'next/navigation'
import { restaurants } from '@/data/restaurants'
import { RestaurantCard } from '@/components/RestaurantCard'
import { Hero } from '@/components/Hero'
import { CantonsList } from '@/components/CantonsList'

export async function generateMetadata({ params }: { params: { canton: string } }) {
  const canton = params.canton.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return {
    title: `Halal Restaurants in ${canton} | Halal Mate`,
    description: `Find authentic Halal restaurants in ${canton}, Switzerland with Halal Mate.`,
    openGraph: {
      title: `Halal Restaurants in ${canton} | Halal Mate`,
      description: `Find authentic Halal restaurants in ${canton}, Switzerland with Halal Mate.`,
      url: `https://halal-mate.ch/${params.canton}`,
      siteName: 'Halal Mate',
      images: [
        {
          url: 'https://halal-mate.ch/og-image.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_CH',
      type: 'website',
    },
  }
}

export default function CantonPage({ params }: { params: { canton: string } }) {
  const canton = params.canton.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const cantonRestaurants = restaurants.filter(restaurant => 
    restaurant.canton.toLowerCase() === canton.toLowerCase()
  )

  if (cantonRestaurants.length === 0) {
    notFound()
  }

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Hero 
        title={`Halal Restaurants in ${canton}`}
        subtitle={<>Discover authentic Halal dining options <br /> in the beautiful canton of {canton}</>}
        buttonText={`Explore ${canton} Restaurants`}
        buttonHref="#canton-restaurants"
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section id="canton-restaurants" className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-black">Halal Restaurants in {canton}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cantonRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
                userLocation={null}
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <CantonsList currentCanton={canton} />
        </section>
      </div>
    </div>
  )
}

