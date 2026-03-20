import type { ReactElement } from "react";
import { CategoriesGrid } from "../../shared/ui/categories-grid";
import { HeroSection } from "../../shared/ui/hero-section";
import { TestimonialsSection } from "../../shared/ui/testimonials-section";

export const HomePage = (): ReactElement => {
  return (
    <main>
      <HeroSection />
      <CategoriesGrid />
      <TestimonialsSection />
    </main>
  );
};
