import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-center justify-center flex-1 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 gradient-brand">404</h1>
          <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/" className="inline-block">
            <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md transition-colors">
              Return to Home
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
