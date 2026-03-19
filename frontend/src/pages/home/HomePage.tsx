import type { ReactElement } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoriesGrid } from "../../shared/ui/categories-grid";
import { HeroSection } from "../../shared/ui/hero-section";
import { TestimonialsSection } from "../../shared/ui/testimonials-section";
import Header from "../../shared/components/Header";
import { CategorySection } from "../../features/category-section";

export const HomePage = (): ReactElement => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  return (
    <main>
      <Header />
      <HeroSection />
      {categoryId ? <CategorySection categoryId={Number(categoryId)} /> : <CategoriesGrid />}
      <TestimonialsSection />
    </main>
  );
};
