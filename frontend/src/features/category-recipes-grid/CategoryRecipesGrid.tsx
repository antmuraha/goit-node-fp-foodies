import { type ReactElement, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchRecipes } from "../../store/slices/recipesSlice";
import RecipeCard from "../../shared/ui/recipe-card";
import styles from "./CategoryRecipesGrid.module.css";

const PAGE_LIMIT = 9;
const SKELETON_COUNT = PAGE_LIMIT;

interface CategoryRecipesGridProps {
    categoryId: number;
    /**
     * TODO: FE-CATEGORY-03
     * When pagination component is ready, pass it here as a slot.
     * The grid already tracks `page` from URL (?page=N) and converts it
     * to `offset` for the API. Pagination just needs to update ?page param.
     * Example usage in CategoryPage:
     *   <CategoryRecipesGrid
     *     categoryId={id}
     *     pagination={<Pagination total={total} limit={PAGE_LIMIT} />}
     *   />
     */
    pagination?: ReactElement;
}

export function CategoryRecipesGrid({
    categoryId,
    pagination,
}: CategoryRecipesGridProps): ReactElement {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const ingredientId = searchParams.get("ingredientId")
        ? Number(searchParams.get("ingredientId"))
        : undefined;
    const areaId = searchParams.get("areaId")
        ? Number(searchParams.get("areaId"))
        : undefined;

    const { list, listStatus, listError } = useSelector(
        (s: RootState) => s.recipes,
    );

    // Fetch recipes when category, page or filters change
    useEffect(() => {
        dispatch(
            fetchRecipes({
                categoryId,
                ingredientId,
                areaId,
                limit: PAGE_LIMIT,
                offset: (page - 1) * PAGE_LIMIT,
            }),
        );
    }, [dispatch, categoryId, page, ingredientId, areaId]);

    // Reset to page 1 when filters change (but not when page itself changes)
    useEffect(() => {
        if (page !== 1) {
            setSearchParams(
                (prev) => {
                    prev.set("page", "1");
                    return prev;
                },
                { replace: true },
            );
        }
        // Intentionally excludes `page` from deps — only runs on filter change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ingredientId, areaId]);

    if (listStatus === "loading") {
        return (
            <div className={styles.wrapper}>
                <ul className={styles.grid} aria-busy="true" aria-label="Loading recipes">
                    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                        <li key={i}>
                            <div className={styles.skeleton} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (listStatus === "failed") {
        return (
            <div className={styles.state} role="alert">
                {listError ?? "Failed to load recipes. Please try again later."}
            </div>
        );
    }

    if (listStatus === "succeeded" && list.length === 0) {
        return (
            <div className={styles.state}>
                No recipes found for the selected filters.
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <ul className={styles.grid} role="list">
                {list.map((recipe) => (
                    <li key={recipe.id}>
                        <RecipeCard
                            id={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            image={recipe.image}
                            thumbnail={recipe.thumbnail}
                            author={recipe.author}
                            variant="grid"
                        />
                    </li>
                ))}
            </ul>

            {/* TODO: FE-CATEGORY-03 — render pagination slot once ready */}
            {pagination}
        </div>
    );
}