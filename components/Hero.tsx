import { Button } from "@/components/ui/button"

interface HeroProps {
  title: string;
  subtitle: React.ReactNode;
  buttonText?: string;
  buttonHref?: string;
}

export function Hero({ 
  title,
  subtitle,
  buttonText = "Discover Halal Restaurants",
  buttonHref = "#nearby-halal-spots"
}: HeroProps) {
  return (
    <div className="bg-white text-black py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-600">
            {subtitle}
          </p>
          <Button 
            size="lg" 
            className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto" 
            asChild
          >
            <a href={buttonHref}>
              {buttonText}
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

