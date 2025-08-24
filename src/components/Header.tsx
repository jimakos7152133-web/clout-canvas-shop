import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import CartDrawer from "@/components/CartDrawer";

const Header = () => {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-card text-center py-2 px-4 text-sm border-b border-border">
        <div className="max-w-7xl mx-auto">
          <span className="text-muted-foreground">
            Free shipping on orders over $75 • Custom designs • Premium quality • Print on demand
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-background/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link to="/">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold cursor-pointer">
                  <span className="gradient-brand">CLOUT</span>
                  <span className="text-foreground">STREET</span>
                </h1>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-foreground hover:text-primary transition-smooth font-medium">
                Home
              </Link>
              <Link to="/products" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                Shop
              </Link>
              <Link to="/products/custom-designs" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                Custom Orders
              </Link>
              <Link to="/products/business-promotion" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                Business Promo
              </Link>
              <a href="#contact" className="text-muted-foreground hover:text-primary transition-smooth font-medium">
                Contact
              </a>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search" 
                  placeholder="Search products..."
                  className="pl-10 bg-secondary border-border focus:border-primary"
                />
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Search className="h-5 w-5 lg:hidden" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Heart className="h-5 w-5" />
              </Button>
              <CartDrawer>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary relative">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </CartDrawer>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;