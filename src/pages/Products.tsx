import { useParams } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Products = () => {
  const { category } = useParams();
  const { data: products, isLoading: productsLoading } = useProducts(category);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Get all unique colors and sizes from products
  const allColors = Array.from(new Set(products?.flatMap(p => p.colors || [])));
  const allSizes = Array.from(new Set(products?.flatMap(p => p.sizes || [])));

  const filteredProducts = products?.filter(product => {
    const priceInRange = product.base_price >= priceRange[0] && product.base_price <= priceRange[1];
    const colorMatch = selectedColors.length === 0 || selectedColors.some(color => product.colors?.includes(color));
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes?.includes(size));
    
    return priceInRange && colorMatch && sizeMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.base_price - b.base_price;
      case 'price-high':
        return b.base_price - a.base_price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const currentCategory = categories?.find(cat => cat.slug === category);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {currentCategory ? currentCategory.description : 'Browse our complete collection'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="space-y-2">
                    <Link to="/products">
                      <Button variant={!category ? "default" : "ghost"} className="w-full justify-start">
                        All Products
                      </Button>
                    </Link>
                    {categories?.map((cat) => (
                      <Link key={cat.id} to={`/products/${cat.slug}`}>
                        <Button 
                          variant={category === cat.slug ? "default" : "ghost"} 
                          className="w-full justify-start"
                        >
                          {cat.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                {allColors.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Color</h4>
                    <div className="flex gap-2 flex-wrap">
                      {allColors.map(color => (
                        <button
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                            selectedColors.includes(color)
                              ? 'border-primary ring-2 ring-primary/20' 
                              : 'border-muted hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : color.toLowerCase() }}
                          title={color}
                        >
                          {selectedColors.includes(color) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-2 h-2 rounded-full ${color.toLowerCase() === 'white' ? 'bg-black' : 'bg-white'}`} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {allSizes.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Size</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {allSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedSizes.includes(size)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-muted hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {filteredProducts?.length || 0} products found
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts?.map((product) => (
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

            {filteredProducts?.length === 0 && !productsLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or browse other categories
                </p>
                <Button onClick={() => {
                  setSortBy("newest");
                  setPriceRange([0, 200]);
                  setSelectedColors([]);
                  setSelectedSizes([]);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;