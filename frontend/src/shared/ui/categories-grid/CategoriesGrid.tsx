// TODO - Implement CategoriesGrid component to display categories with images
import { NavLink } from "react-router-dom";
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
                category.image && (
                  <NavLink key={category.id} to={`/category/${category.id}`}>
                    <ImageCategory key={category.id} src={category.image} alt={category.name} />
                  </NavLink>
                ),
            )}
        </div>
      </section>
    </div>
  );
};

export default CategoriesGrid;
