import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Share2, 
  Smartphone, 
  Shield, 
  Zap, 
  Users,
  Package,
  Navigation,
  QrCode
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "3-Meter Precision",
      description: "Pinpoint accuracy down to 3x3 meters using advanced GPS technology.",
      color: "text-primary"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Universal Sharing",
      description: "Share via WhatsApp, SMS, email, or QR codes. Works with or without the app.",
      color: "text-accent"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Offline Ready",
      description: "Generate and access addresses even without internet connection.",
      color: "text-primary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your location data stays private. Share only what you want, when you want.",
      color: "text-accent"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Delivery Friendly",
      description: "Perfect for e-commerce, food delivery, and courier services.",
      color: "text-primary"
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: "Instant Navigation",
      description: "One-tap directions to any GeoAddress using Google Maps.",
      color: "text-accent"
    }
  ];

  const useCases = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "For Individuals",
      items: ["Receive deliveries accurately", "Share your exact location", "Emergency services", "Social meetups"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "For Businesses",
      items: ["Reduce delivery failures", "Improve customer service", "Emergency response", "Asset tracking"]
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "For Services",
      items: ["Ride-hailing pickup", "Utility maintenance", "Government services", "Event planning"]
    }
  ];

  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        {/* Features Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">GeoAddress NG</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built specifically for Nigeria's unique addressing challenges with world-class technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className={`${feature.color} mb-2`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Cases */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Perfect for <span className="text-accent">Every Nigerian</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {useCase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;