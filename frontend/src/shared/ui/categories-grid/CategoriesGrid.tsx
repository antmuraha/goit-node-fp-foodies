// TODO - Implement CategoriesGrid component to display categories with images
import { useDataCategories } from "../../hooks/useDataCategories";
import { ImageCategory } from "../image-category";

const CategoriesGrid = () => {
  const { categories } = useDataCategories();

  return (
    <div>
      <section>
        <h2>CategoriesGrid</h2>
        <div>
          {categories.length > 0 &&
            categories.map(
              (category) =>
                category.image && <ImageCategory key={category.id} src={category.image} alt={category.name} />,
            )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesGrid;
