import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Copy, Share2, QrCode, BookOpen, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AddressGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, code: "GAN.F84G.ABC", label: "My Home", note: "Blue gate, 2nd floor" },
    { id: 2, code: "GAN.H92K.XYZ", label: "Office", note: "Adeniyi Jones Avenue" },
  ]);
  const { toast } = useToast();

  const generateAddress = async () => {
    setIsGenerating(true);
    
    // Simulate GPS location fetch
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random GeoAddress code
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const code = `GAN.${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}.${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
    
    setCurrentAddress(code);
    setIsGenerating(false);
    
    toast({
      title: "GeoAddress Generated!",
      description: "Your precise location has been mapped.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard.",
    });
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Generate Your <span className="text-primary">GeoAddress</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a precise, shareable digital address for any location in Nigeria. 
            Works offline and updates in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Address Generator */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={generateAddress}
                disabled={isGenerating}
                variant="hero"
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Getting Location...
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    Get My GeoAddress
                  </>
                )}
              </Button>

              {currentAddress && (
                <div className="space-y-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-2">Your GeoAddress:</div>
                    <div className="text-2xl font-mono font-bold text-primary">
                      {currentAddress}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Near Victoria Island, Lagos State
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentAddress)}
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Saved Addresses */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Saved Addresses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedAddresses.map((address) => (
                <div key={address.id} className="bg-secondary rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-semibold">{address.label}</div>
                      <div className="text-sm font-mono text-primary">{address.code}</div>
                      <div className="text-xs text-muted-foreground">{address.note}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(address.code)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4" />
                Save Current Location
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Find Any GeoAddress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter GeoAddress (e.g., GAN.F84G.ABC)"
                className="flex-1"
              />
              <Button variant="hero">
                <Navigation className="w-4 h-4" />
                Locate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AddressGenerator;