import { useCallback, useEffect, useMemo, useRef, type ReactElement } from "react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { CategoryRecipesGrid } from "../../features/category-recipes-grid";
import { CategoryFilterPanel } from "../../features/category-filters";
import { HeroSection } from "../../shared/ui";
import { useDataRecipes, useScrollToTop } from "../../shared/hooks";
import { TestimonialsSection } from "../../shared/ui/testimonials-section";
import styles from "./CategoryPage.module.css";
import { APP_ROUTES } from "../../shared/constants/routes";
import { Icon } from "../../shared/components/Icon";

const PAGE_LIMIT = 9;
const SCROLL_TO_CLASS = "scroll-to-top-trigger";

const MOCK_CATEGORY_DESCRIPTION =
  "Experience the art of taste, where every dish embodies creativity and every flavor is crafted with intention.";

export const CategoryPage = (): ReactElement => {
  const { id: categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  useScrollToTop(`.${SCROLL_TO_CLASS}`);

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const ingredientId = searchParams.get("ingredientId") ? Number(searchParams.get("ingredientId")) : undefined;
  const areaId = searchParams.get("areaId") ? Number(searchParams.get("areaId")) : undefined;

  const { recipes, total, isLoading, error, loadRecipes } = useDataRecipes({
    categoryId,
    ingredientId,
    areaId,
    limit: PAGE_LIMIT,
    offset: (page - 1) * PAGE_LIMIT,
  });
  const totalPages = useMemo(() => Math.ceil((total ?? 0) / PAGE_LIMIT), [total]);

  const category = useMemo(() => {
    if (!categoryId) return { title: "Category", description: "Loading category details..." };
    return recipes.length
      ? {
          title: recipes[0].category.name,
          description: MOCK_CATEGORY_DESCRIPTION,
        }
      : { title: "Category", description: "Loading category details..." };
  }, [recipes, categoryId]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        prev.set("page", String(newPage));
        return prev;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (typeof loadRecipes === "function") {
      loadRecipes();
    }
  }, [page, categoryId, ingredientId, areaId]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchParams(
      (prev) => {
        prev.set("page", "1");
        return prev;
      },
      { replace: true },
    );
  }, [ingredientId, areaId]);

  return (
    <>
      <HeroSection />
      <header className={styles.header + " " + SCROLL_TO_CLASS}>
        <NavLink to={APP_ROUTES.HOME} className={styles.backLink}>
          <Icon name="arrow-up-right" size={16} color="text-primary" />
          <span>Back</span>
        </NavLink>
        <h1>{category.title}</h1>
        <p>{category.description}</p>
      </header>
      <main className={styles.main}>
        <aside className={styles.aside}>
          <CategoryFilterPanel />
        </aside>
        <section className={styles.section}>
          {isLoading ? (
            <>
              <div className={styles.wrapper}>
                <ul className={styles.grid} aria-busy="true" aria-label="Loading recipes">
                  {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                    <li key={i}>
                      <div className={styles.skeleton} />
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              {error && (
                <div className={styles.state} role="alert">
                  {error}
                </div>
              )}
              {recipes.length ? (
                <>
                  <CategoryRecipesGrid
                    list={recipes}
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <>
                  <div className={styles.state}>No recipes found for the selected filters.</div>
                </>
              )}
            </>
          )}
        </section>
      </main>
      <TestimonialsSection />
    </>
  );
};
