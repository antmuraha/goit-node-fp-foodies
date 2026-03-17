import { useDataCategories } from "../../hooks/useDataCategories";
import { CategoryCard } from "../../../features/categories/category-card";

const CategoriesGrid = () => {
  const { categories } = useDataCategories();

  return (
    <div>
      <section>
        <h2>CategoriesGrid</h2>
        <div>
          {categories.length > 0 &&
            categories.map(
              (category) => (
                <CategoryCard 
                  key={category.id} 
                  id={category.id} 
                  name={category.name} 
                  image={category.image} />
                ),
            )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesGrid;

