import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Star } from 'lucide-react'

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

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{restaurant.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex items-start mb-2">
          <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
          <p>{restaurant.vicinity}</p>
        </div>
        {restaurant.opening_hours && (
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <p>{restaurant.opening_hours.open_now ? 'Open now' : 'Closed'}</p>
          </div>
        )}
        {restaurant.rating && (
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 mr-2 fill-yellow-400 flex-shrink-0" />
            <p>{restaurant.rating.toFixed(1)} ({restaurant.user_ratings_total} reviews)</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button asChild className="w-full sm:w-auto text-sm px-3 py-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.vicinity)}&destination_place_id=${restaurant.place_id}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Get Directions
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

