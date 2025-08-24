import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryShowcase from "@/components/CategoryShowcase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroCarousel />
        <CategoryShowcase />
      </main>
    </div>
  );
};

export default Index;