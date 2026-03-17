import { NavLink } from "react-router-dom";
import { useDataUserRecipes } from "../../hooks/useDataUsers";

type UserRecipesListProps = {
  user: string;
};

const UserRecipesList = ({ user }: UserRecipesListProps) => {
  const { data } = useDataUserRecipes(user);

  return (
    <div>
      <h2>My Recipes</h2>
      {data.length === 0 ? (
        <p>You have no recipes yet.</p>
      ) : (
        <ul>
          {data.map((recipe) => (
            <NavLink to={`/recipe/${recipe.id}`} key={recipe.id}>
              <li>{recipe.title}</li>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRecipesList;
