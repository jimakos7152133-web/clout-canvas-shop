import { Button } from "@/components/ui/button";
import productTshirt from "@/assets/product-tshirt.jpg";
import heroHoodie from "@/assets/hero-hoodie.jpg";
import businessPromo from "@/assets/business-promo.jpg";
import productBomber from "@/assets/product-bomber.jpg";

const categories = [
  {
    id: 1,
    name: "T-Shirts",
    image: productTshirt,
    itemCount: 24,
    description: "Essential pieces for everyday wear",
    href: "/category/tshirts"
  },
  {
    id: 2,
    name: "Hoodies",
    image: heroHoodie,
    itemCount: 18,
    description: "Premium comfort meets street style",
    href: "/category/hoodies"
  },
  {
    id: 3,
    name: "Business Promo",
    image: businessPromo,
    itemCount: 32,
    description: "Professional branded merchandise",
    href: "/category/business"
  },
  {
    id: 4,
    name: "Outerwear",
    image: productBomber,
    itemCount: 12,
    description: "Jackets, bombers & fleece",
    href: "/category/outerwear"
  }
];

const CategoryShowcase = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Shop by <span className="gradient-brand">Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our curated collections designed for the modern streetwear enthusiast. 
            Each piece tells a story of urban culture and individual expression.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-xl card-gradient border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-card"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-2">
                  <span className="text-sm text-primary font-medium">
                    {category.itemCount} items
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-none group-hover:shadow-brand"
                >
                  Shop Now
                </Button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card-gradient border border-border/50 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Need <span className="gradient-brand">Custom Designs</span>?
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We specialize in print-on-demand services. From individual custom pieces to bulk business orders, 
              we've got you covered with premium quality and fast turnaround times.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="shadow-glow">
                Start Custom Order
              </Button>
              <Button variant="outline" size="lg">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;