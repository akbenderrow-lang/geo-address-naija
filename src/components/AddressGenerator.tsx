import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Copy, Share2, QrCode, BookOpen, Navigation, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SavedAddress } from "@/types";
import QRCode from "react-qr-code";

const AddressGenerator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    note: "",
  });

  const loadAddresses = () => {
    if (!user) return;
    
    const savedAddresses = JSON.parse(
      localStorage.getItem(`geoaddress_addresses_${user.id}`) || '[]'
    );
    setAddresses(savedAddresses.slice(0, 3)); // Show only first 3
  };

  const generateAddress = async () => {
    setIsGenerating(true);
    
    // Simulate GPS location fetch
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate a random GeoAddress code
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const code = `GAN.${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}.${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
    
    // Mock location data
    const locations = [
      "Victoria Island, Lagos State",
      "Ikoyi, Lagos State", 
      "Lekki Phase 1, Lagos State",
      "Surulere, Lagos State",
      "Ikeja GRA, Lagos State"
    ];
    
    setCurrentAddress(code);
    setCurrentLocation(locations[Math.floor(Math.random() * locations.length)]);
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

  const shareAddress = () => {
    if (!currentAddress) return;
    
    const shareText = `📍 My Current Location\nGeoAddress: ${currentAddress}\n${currentLocation}\n\nShared via GeoAddress NG`;
    
    if (navigator.share) {
      navigator.share({
        title: `GeoAddress: ${currentAddress}`,
        text: shareText,
      });
    } else {
      copyToClipboard(shareText);
      toast({
        title: "Share Text Copied",
        description: "Share the copied text with others.",
      });
    }
  };

  const navigateToAddress = () => {
    // Mock coordinates for Lagos area
    const lat = 6.5244 + (Math.random() - 0.5) * 0.1;
    const lng = 3.3792 + (Math.random() - 0.5) * 0.1;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const saveCurrentAddress = () => {
    if (!user || !currentAddress) return;

    const address: SavedAddress = {
      id: Date.now().toString(),
      userId: user.id,
      code: currentAddress,
      label: newAddress.label,
      note: newAddress.note,
      latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
      longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
      generalAddress: currentLocation || "Lagos State, Nigeria",
      createdAt: new Date().toISOString(),
    };

    const existingAddresses = JSON.parse(
      localStorage.getItem(`geoaddress_addresses_${user.id}`) || '[]'
    );
    const updatedAddresses = [...existingAddresses, address];
    
    localStorage.setItem(
      `geoaddress_addresses_${user.id}`,
      JSON.stringify(updatedAddresses)
    );

    setNewAddress({ label: "", note: "" });
    setIsSaveModalOpen(false);
    loadAddresses();

    toast({
      title: "Address Saved",
      description: `${address.label} has been added to your addresses.`,
    });
  };

  // Load addresses when user changes
  React.useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

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
                      Near {currentLocation}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareAddress}
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsQrModalOpen(true)}
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={navigateToAddress}
                    >
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </Button>
                  </div>

                  {user && (
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => setIsSaveModalOpen(true)}
                      className="w-full mt-2"
                    >
                      <Save className="w-4 h-4" />
                      Save This Address
                    </Button>
                  )}
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
              {user ? (
                addresses.length > 0 ? (
                  addresses.map((address) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No saved addresses yet</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Sign in to see saved addresses</p>
                </div>
              )}
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

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - Current Location</DialogTitle>
          </DialogHeader>
          
          {currentAddress && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode
                  value={`${currentAddress} - ${currentLocation}`}
                  size={200}
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="font-mono text-sm font-bold text-primary">
                  {currentAddress}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentLocation}
                </p>
              </div>

              <Button
                onClick={() => copyToClipboard(currentAddress)}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Address Code
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Address Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current Address</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-secondary rounded-lg p-4">
              <div className="text-sm text-muted-foreground mb-2">Generated GeoAddress:</div>
              <div className="text-lg font-mono font-bold text-primary">
                {currentAddress}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {currentLocation}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="save-label">Label *</Label>
              <Input
                id="save-label"
                placeholder="e.g., Current Location, Meeting Point"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="save-note">Note (Optional)</Label>
              <Textarea
                id="save-note"
                placeholder="e.g., Near the coffee shop, 3rd floor"
                value={newAddress.note}
                onChange={(e) => setNewAddress({ ...newAddress, note: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setNewAddress({ label: "", note: "" });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveCurrentAddress}
                variant="hero"
                className="flex-1"
                disabled={!newAddress.label.trim()}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AddressGenerator;