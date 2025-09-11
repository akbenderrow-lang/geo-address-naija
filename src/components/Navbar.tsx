import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-primary">GeoAddress NG</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>Welcome, {user.name}</span>
                </div>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                variant="hero"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>Welcome, {user.name}</span>
                </div>
                <Button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                variant="hero"
                className="w-full"
              >
                <User className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};