import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroHoodie from "@/assets/hero-hoodie.jpg";
import productTshirt from "@/assets/product-tshirt.jpg";
import businessPromo from "@/assets/business-promo.jpg";

const slides = [
  {
    id: 1,
    image: heroHoodie,
    badge: "New Collection",
    title: "STREET\nCLOTHING\nBRAND",
    subtitle: "Premium custom designs. Express your style with our exclusive streetwear collection. Made for the culture.",
    price: "From $49",
    cta: "Shop Now"
  },
  {
    id: 2,
    image: productTshirt,
    badge: "Limited Edition",
    title: "URBAN\nSTYLE\nREDEFINED",
    subtitle: "Authentic streetwear that speaks your language. Unique designs crafted for the bold and fearless.",
    price: "From $29",
    cta: "Explore"
  },
  {
    id: 3,
    image: businessPromo,
    badge: "Business Solutions",
    title: "CUSTOM\nBRANDING\nSOLUTIONS",
    subtitle: "Professional promotional items for your business. High-quality branded merchandise that makes an impact.",
    price: "From $15",
    cta: "Get Quote"
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 translate-x-0' 
              : index < currentSlide 
                ? 'opacity-0 -translate-x-full' 
                : 'opacity-0 translate-x-full'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${slide.image})`
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-block mb-6">
                  <span className="bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-glow px-4 py-2 rounded-full text-sm font-medium">
                    {slide.badge}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {slide.title.split('\n').map((line, i) => (
                    <div key={i}>
                      {i === 1 ? (
                        <span className="gradient-brand">{line}</span>
                      ) : (
                        <span className="text-foreground">{line}</span>
                      )}
                    </div>
                  ))}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="text-2xl font-bold text-foreground">
                    {slide.price}
                  </div>
                  <Button variant="hero" size="lg" className="shadow-glow transition-bounce hover:scale-105">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 hover:bg-background/20 backdrop-blur-sm border border-border/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/10 hover:bg-background/20 backdrop-blur-sm border border-border/30"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary shadow-brand' 
                : 'bg-background/30 hover:bg-background/50'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 text-foreground/70 font-mono text-sm">
        0{currentSlide + 1}
      </div>
    </div>
  );
};

export default HeroCarousel;