import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      {user ? (
        <Dashboard />
      ) : (
        <>
          <Hero />
          <Features />
        </>
      )}
    </div>
  );
};

export default Index;
