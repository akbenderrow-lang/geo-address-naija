import { Button } from "@/components/ui/button";
import { MapPin, Share2, Users, Zap } from "lucide-react";
import heroImage from "@/assets/nigeria-map-hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero flex items-center justify-center px-4 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Digital Addressing for Nigeria</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Every Location
              <br />
              <span className="text-accent">Precisely Mapped</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-lg">
              GeoAddress NG gives every Nigerian a simple, precise digital address. 
              No more "behind the big tree" or "yellow building".
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Button variant="accent" size="lg" className="text-lg px-8 py-6">
                <MapPin className="w-5 h-5" />
                Get My GeoAddress
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
                <Share2 className="w-5 h-5" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-accent">3m+</div>
                <div className="text-sm text-white/80">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">36</div>
                <div className="text-sm text-white/80">States Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">24/7</div>
                <div className="text-sm text-white/80">Available</div>
              </div>
            </div>
          </div>

          {/* Right content - Image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Nigeria Digital Map"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-sm">1M+ Users</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-accent text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold text-sm">Instant Location</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;