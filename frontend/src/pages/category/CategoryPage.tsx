import { type ReactElement } from "react";
import { useParams } from "react-router-dom";
import { CategoryRecipesGrid } from "../../features/category-recipes-grid";

export const CategoryPage = (): ReactElement => {
    const { id: categoryId } = useParams();

    return (
        <>
            <header>
                <h1>Category page</h1>
            </header>
            <main>
                <aside>
                    {/* TODO: FE-CATEGORY-02 — category filters */}
                </aside>
                <section>
                    {/* TODO: FE-CATEGORY-03 — pass pagination prop once ready */}
                    <CategoryRecipesGrid categoryId={Number(categoryId)} />
                </section>
            </main>
        </>
    );
};