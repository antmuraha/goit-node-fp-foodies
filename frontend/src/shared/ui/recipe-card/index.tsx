import { NavLink } from "react-router-dom";
import { RecipeSummary } from "../../../entities/recipe/types";

type RecipeCardProps = RecipeSummary;

const RecipeCard = (prop: RecipeCardProps) => {
  return (
    <div>
      <h3>{prop.title}</h3>
      <NavLink to={`/recipe/${prop.id}`}>
        <img src={prop.image ?? prop.thumbnail ?? undefined} alt={prop.title} width={200} />
      </NavLink>
      <p>{prop.description}</p>
    </div>
  );
};

export default RecipeCard;
