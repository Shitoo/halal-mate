import { Badge } from "../components/ui/badge"
import Link from 'next/link'

interface CantonsListProps {
  currentCanton?: string | null;
}

export function CantonsList({ currentCanton }: CantonsListProps) {
  const cantons = [
    { name: "Zürich", count: 5 },
    { name: "Geneva", count: 4 },
    { name: "Basel", count: 3 },
    { name: "Bern", count: 2 },
    { name: "Lausanne", count: 2 },
  ];

  const filteredCantons = cantons.filter(canton => 
    canton.name.toLowerCase() !== currentCanton?.toLowerCase()
  );

  return (
    <div className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Explore Other Halal Restaurants <br className="hidden sm:inline" /> per Swiss Cantons
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8 text-center">
          Discover Halal restaurants in other Swiss cantons <br className="hidden sm:inline" /> and expand your culinary journey across Switzerland.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCantons.map((canton) => (
            <div key={canton.name} className="flex items-center justify-between p-2">
              <Link href={`/${canton.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-900 hover:underline flex items-center">
                <span className="text-sm sm:text-base">{canton.name}</span>
                <Badge variant="secondary" className="bg-black text-white hover:bg-black ml-2 text-xs sm:text-sm">
                  {canton.count}
                </Badge>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

