import { useDataUserRecipes } from "../../hooks/useDataUsers";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";

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
            <ProfileRecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              instructions={recipe.instructions}
              image={recipe.image}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRecipesList;
