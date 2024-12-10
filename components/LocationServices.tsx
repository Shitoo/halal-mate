import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface LocationServicesProps {
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

export function LocationServices({ onLocationUpdate }: LocationServicesProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      onLocationUpdate(JSON.parse(savedLocation));
    }
  }, [onLocationUpdate]);

  const handleEnableLocation = () => {
    setStatus('loading');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          localStorage.setItem('userLocation', JSON.stringify(location));
          onLocationUpdate(location);
          setStatus('idle');
        },
        (error) => {
          setStatus('error');
          switch(error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage("You denied the request for geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setErrorMessage("The request to get user location timed out.");
              break;
            default:
              setErrorMessage("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setStatus('error');
      setErrorMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleRefreshLocation = () => {
    localStorage.removeItem('userLocation');
    handleEnableLocation();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
      <AlertCircle className="w-12 h-12 text-muted-foreground mb-2" />
      <p className="text-center mb-4">Enable location services to find Halal Mate spots near you!</p>
      <div className="flex items-center space-x-2 mb-4">
        <Button onClick={handleEnableLocation} disabled={status === 'loading'}>
          <MapPin className="w-4 h-4 mr-2" />
          {status === 'loading' ? "Enabling..." : "Enable Location Services"}
        </Button>
      </div>
      <Button onClick={handleRefreshLocation} variant="outline" className="mb-4">
        <RefreshCw className="w-4 h-4 mr-2" /> Refresh Location
      </Button>
      {status === 'error' && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="mt-2">Why do we need your location?</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Halal Mate Location Services</DialogTitle>
            <DialogDescription>
              Halal Mate uses your location to show you nearby halal restaurants. This helps you discover great halal dining options in your area quickly and easily. We respect your privacy and do not store your location on our servers or use it for any other purpose.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

