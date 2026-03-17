import type { ReactElement } from "react";
import { CategoriesGrid } from "../../shared/ui/categories-grid";
import { HeroSection } from "../../shared/ui/hero-section";
import { TestimonialsSection } from "../../shared/ui/testimonials-section";
import Header from "../../shared/components/Header";

export const HomePage = (): ReactElement => {
  return (
    <main>
      <Header />
      <HeroSection />
      <CategoriesGrid />
      <TestimonialsSection />
    </main>
  );
};

