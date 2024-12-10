import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { restaurants } from '@/data/restaurants'
import { RestaurantCard } from '@/components/RestaurantCard'
import { Hero } from '@/components/Hero'
import { CantonsList } from '@/components/CantonsList'

type Props = {
  params: Promise<{ canton: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { canton } = await params
  const formattedCanton = canton.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  return {
    title: `Halal Restaurants in ${formattedCanton} | Halal Mate`,
    description: `Find authentic Halal restaurants in ${formattedCanton}, Switzerland with Halal Mate.`,
    openGraph: {
      title: `Halal Restaurants in ${formattedCanton} | Halal Mate`,
      description: `Find authentic Halal restaurants in ${formattedCanton}, Switzerland with Halal Mate.`,
      url: `https://halal-mate.com/${canton}`,
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

export default async function CantonPage({ params }: Props) {
  const { canton } = await params
  const formattedCanton = canton.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')

  const cantonRestaurants = restaurants.filter(restaurant => 
    restaurant.canton.toLowerCase() === formattedCanton.toLowerCase()
  )

  if (cantonRestaurants.length === 0) {
    notFound()
  }

  return (
    <div className="bg-white flex flex-col min-h-screen">
      <Hero 
        title={`Halal Restaurants in ${formattedCanton}`}
        subtitle={<>Discover authentic Halal dining options <br /> in the beautiful canton of {formattedCanton}</>}
        buttonText={`Explore ${formattedCanton} Restaurants`}
        buttonHref="#canton-restaurants"
      />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <section id="canton-restaurants" className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-black">Halal Restaurants in {formattedCanton}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cantonRestaurants.map((restaurant) => (
              <RestaurantCard 
                key={restaurant.id} 
                restaurant={restaurant} 
              />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <CantonsList currentCanton={formattedCanton} />
        </section>
      </div>
    </div>
  )
}

