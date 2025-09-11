import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddressManager } from "@/components/AddressManager";
import { MapComponent } from "@/components/GoogleMap";
import AddressGenerator from "@/components/AddressGenerator";
import { MapPin, Home, Search } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your GeoAddress Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your addresses, generate new ones, and navigate with precision.
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="addresses" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            My Addresses
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Map & Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <AddressGenerator />
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <AddressManager />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <MapComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};