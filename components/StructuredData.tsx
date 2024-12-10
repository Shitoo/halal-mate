import { Restaurant } from '@/data/restaurants'

interface StructuredDataProps {
  restaurants: Restaurant[]
}

export function StructuredData({ restaurants }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": restaurants.map((restaurant, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Restaurant",
        "name": restaurant.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": restaurant.address,
          "addressLocality": restaurant.city,
          "addressRegion": restaurant.canton,
          "addressCountry": "CH"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": restaurant.lat,
          "longitude": restaurant.lng
        },
        "url": `https://halal-mate.ch/restaurant/${restaurant.id}`,
        "telephone": "+41000000000", // Replace with actual phone number if available
        "servesCuisine": "Halal",
        "openingHours": restaurant.openingHours
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

