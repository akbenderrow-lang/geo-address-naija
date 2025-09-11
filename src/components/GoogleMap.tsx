import { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation, MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapLocation {
  lat: number;
  lng: number;
  address?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 6.5244, // Lagos, Nigeria
  lng: 3.3792,
};

// For demo purposes - in production, you'd need a real Google Maps API key
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

export const MapComponent = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });
      
      // Generate mock address
      const mockAddress = `Near Lagos Island, Lagos State, Nigeria`;
      setSelectedLocation({ lat, lng, address: mockAddress });
      
      toast({
        title: "Location Selected",
        description: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Mock search - in production, use Google Places API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock results for Nigerian locations
    const mockResults = [
      { name: "Victoria Island", lat: 6.4281, lng: 3.4219 },
      { name: "Ikeja", lat: 6.6018, lng: 3.3515 },
      { name: "Surulere", lat: 6.4969, lng: 3.3515 },
      { name: "Yaba", lat: 6.5158, lng: 3.3696 },
    ];
    
    const result = mockResults.find(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || mockResults[0];
    
    setSelectedLocation({
      lat: result.lat,
      lng: result.lng,
      address: `${result.name}, Lagos State, Nigeria`
    });
    
    if (map) {
      map.panTo({ lat: result.lat, lng: result.lng });
      map.setZoom(15);
    }
    
    setIsSearching(false);
    toast({
      title: "Location Found",
      description: `Showing ${result.name}`,
    });
  };

  const getDirections = () => {
    if (selectedLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
      window.open(url, '_blank');
    }
  };

  // Fallback map for when Google Maps API is not available
  const FallbackMap = () => (
    <div className="w-full h-[400px] bg-secondary rounded-lg flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          Google Maps integration requires API key
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Click anywhere to simulate location selection
        </p>
        <Button 
          onClick={() => {
            const mockLat = 6.5244 + (Math.random() - 0.5) * 0.01;
            const mockLng = 3.3792 + (Math.random() - 0.5) * 0.01;
            setSelectedLocation({
              lat: mockLat,
              lng: mockLng,
              address: "Mock Location, Lagos State, Nigeria"
            });
            toast({
              title: "Mock Location Generated",
              description: `Lat: ${mockLat.toFixed(6)}, Lng: ${mockLng.toFixed(6)}`,
            });
          }}
          variant="outline"
          className="mt-4"
        >
          Generate Mock Location
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Map
        </CardTitle>
        
        <div className="flex gap-2">
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            className="flex-1"
          />
          <Button 
            onClick={searchLocation}
            disabled={isSearching}
            variant="outline"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY" ? (
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedLocation || defaultCenter}
              zoom={12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker 
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                >
                  <InfoWindow position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}>
                    <div className="p-2">
                      <p className="font-semibold">Selected Location</p>
                      <p className="text-sm">{selectedLocation.address}</p>
                      <p className="text-xs text-gray-500">
                        {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                </Marker>
              )}
            </GoogleMap>
          </LoadScript>
        ) : (
          <FallbackMap />
        )}
        
        {selectedLocation && (
          <div className="mt-4 flex gap-2">
            <Button onClick={getDirections} variant="hero" className="flex-1">
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};