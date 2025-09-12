import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Copy, Share2, QrCode, Navigation, Plus, Edit, Trash2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SavedAddress } from "@/types";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

export const AddressManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isDecipherModalOpen, setIsDecipherModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [decipherCode, setDecipherCode] = useState("");
  const [decipheredAddress, setDecipheredAddress] = useState<SavedAddress | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    note: "",
    code: "",
  });

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = () => {
    if (!user) return;
    
    const savedAddresses = JSON.parse(
      localStorage.getItem(`geoaddress_addresses_${user.id}`) || '[]'
    );
    setAddresses(savedAddresses);
  };

  const saveAddresses = (updatedAddresses: SavedAddress[]) => {
    if (!user) return;
    
    localStorage.setItem(
      `geoaddress_addresses_${user.id}`,
      JSON.stringify(updatedAddresses)
    );
    setAddresses(updatedAddresses);
  };

  const generateGeoAddress = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    return `GAN.${letters[Math.floor(Math.random() * letters.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}${letters[Math.floor(Math.random() * letters.length)]}.${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
  };

  const handleAddAddress = () => {
    if (!user || !newAddress.label.trim()) return;

    const address: SavedAddress = {
      id: Date.now().toString(),
      userId: user.id,
      code: newAddress.code || generateGeoAddress(),
      label: newAddress.label,
      note: newAddress.note,
      latitude: 6.5244 + (Math.random() - 0.5) * 0.1, // Mock coordinates around Lagos
      longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
      generalAddress: `${newAddress.label}, Lagos State, Nigeria`,
      createdAt: new Date().toISOString(),
    };

    const updatedAddresses = [...addresses, address];
    saveAddresses(updatedAddresses);

    setNewAddress({ label: "", note: "", code: "" });
    setIsAddModalOpen(false);

    toast({
      title: "Address Saved",
      description: `${address.label} has been added to your addresses.`,
    });
  };

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
    setNewAddress({
      label: address.label,
      note: address.note || "",
      code: address.code,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateAddress = () => {
    if (!user || !editingAddress) return;

    const updatedAddress: SavedAddress = {
      ...editingAddress,
      label: newAddress.label,
      note: newAddress.note,
      code: newAddress.code,
    };

    const updatedAddresses = addresses.map(addr =>
      addr.id === editingAddress.id ? updatedAddress : addr
    );

    saveAddresses(updatedAddresses);
    setEditingAddress(null);
    setNewAddress({ label: "", note: "", code: "" });
    setIsAddModalOpen(false);

    toast({
      title: "Address Updated",
      description: `${updatedAddress.label} has been updated.`,
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    saveAddresses(updatedAddresses);

    toast({
      title: "Address Deleted",
      description: "Address has been removed from your list.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard.",
    });
  };

  const shareAddress = (address: SavedAddress) => {
    const shareText = `📍 ${address.label}\nGeoAddress: ${address.code}\n${address.generalAddress}\n\nShared via GeoAddress NG`;
    
    if (navigator.share) {
      navigator.share({
        title: `GeoAddress: ${address.label}`,
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

  const navigateToAddress = (address: SavedAddress) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`;
    window.open(url, '_blank');
  };

  const showQrCode = (address: SavedAddress) => {
    setSelectedAddress(address);
    setIsQrModalOpen(true);
  };

  const decipherAddress = () => {
    if (!decipherCode.trim()) return;
    
    const found = addresses.find(addr => 
      addr.code.toLowerCase().includes(decipherCode.toLowerCase())
    );
    
    if (found) {
      setDecipheredAddress(found);
      toast({
        title: "Address Found!",
        description: `Found: ${found.label}`,
      });
    } else {
      setDecipheredAddress(null);
      toast({
        title: "Address Not Found",
        description: "No matching address found in your saved addresses.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please sign in to manage your addresses.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsDecipherModalOpen(true)} variant="outline">
            <Search className="w-4 h-4" />
            Decipher
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} variant="hero">
            <Plus className="w-4 h-4" />
            Add Address
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
              <Button onClick={() => setIsAddModalOpen(true)} variant="outline">
                <Plus className="w-4 h-4" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card key={address.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{address.label}</h3>
                    <p className="text-sm font-mono text-primary font-bold">{address.code}</p>
                    <p className="text-sm text-muted-foreground">{address.generalAddress}</p>
                    {address.note && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📝 {address.note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(address.code)}
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareAddress(address)}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToAddress(address)}
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => showQrCode(address)}
                  >
                    <QrCode className="w-4 h-4" />
                    QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Address Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label *</Label>
              <Input
                id="label"
                placeholder="e.g., Home, Office, Mom's House"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">GeoAddress Code</Label>
              <Input
                id="code"
                placeholder="Leave empty to auto-generate"
                value={newAddress.code}
                onChange={(e) => setNewAddress({ ...newAddress, code: e.target.value })}
              />
              {!newAddress.code && (
                <p className="text-xs text-muted-foreground">
                  A unique code will be generated automatically
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="e.g., Use the blue gate, 2nd floor"
                value={newAddress.note}
                onChange={(e) => setNewAddress({ ...newAddress, note: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingAddress(null);
                  setNewAddress({ label: "", note: "", code: "" });
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                variant="hero"
                className="flex-1"
                disabled={!newAddress.label.trim()}
              >
                {editingAddress ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code - {selectedAddress?.label}</DialogTitle>
          </DialogHeader>
          
          {selectedAddress && (
            <div className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode
                  value={`${selectedAddress.code} - ${selectedAddress.generalAddress}`}
                  size={200}
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="font-mono text-sm font-bold text-primary">
                  {selectedAddress.code}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedAddress.generalAddress}
                </p>
              </div>

              <Button
                onClick={() => copyToClipboard(selectedAddress.code)}
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

      {/* Decipher Address Modal */}
      <Dialog open={isDecipherModalOpen} onOpenChange={setIsDecipherModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Decipher Address</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decipher-code">Enter GeoAddress Code</Label>
              <Input
                id="decipher-code"
                placeholder="e.g., GAN.A1B.CDE"
                value={decipherCode}
                onChange={(e) => setDecipherCode(e.target.value)}
              />
            </div>

            <Button
              onClick={decipherAddress}
              variant="hero"
              className="w-full"
              disabled={!decipherCode.trim()}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Address
            </Button>

            {decipheredAddress && (
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{decipheredAddress.label}</h3>
                    <p className="font-mono text-sm font-bold text-primary">
                      {decipheredAddress.code}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {decipheredAddress.generalAddress}
                    </p>
                    {decipheredAddress.note && (
                      <p className="text-xs text-muted-foreground">
                        📝 {decipheredAddress.note}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateToAddress(decipheredAddress)}
                    >
                      <Navigation className="w-4 h-4" />
                      Navigate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showQrCode(decipheredAddress)}
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => {
                setIsDecipherModalOpen(false);
                setDecipherCode("");
                setDecipheredAddress(null);
              }}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};