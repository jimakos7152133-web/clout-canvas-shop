import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShowcase from "@/components/CategoryShowcase";
import { useProducts } from "@/hooks/useProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <CategoryShowcase />
        
        {/* Featured Products Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our latest collection of premium streetwear and custom apparel
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-64 rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 8).map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.is_customizable && (
                        <Badge className="absolute top-2 right-2 bg-primary">
                          Customizable
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold">${product.base_price}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.stock_quantity} in stock
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Link to={`/product/${product.slug}`}>
                          <Button className="w-full">View Details</Button>
                        </Link>
                        {product.is_customizable && (
                          <Link to={`/custom/${product.slug}`}>
                            <Button variant="outline" className="w-full">
                              Customize
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg">View All Products</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;