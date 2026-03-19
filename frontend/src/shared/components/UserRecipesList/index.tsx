import { useDataUserRecipes } from "../../hooks/useDataUsers";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";
import { EmptyState } from "../../ui";

type UserRecipesListProps = {
  user: string;
};

const UserRecipesList = ({ user }: UserRecipesListProps) => {
  const { data } = useDataUserRecipes(user);

  return (
    <div>
      {data.length === 0 ? (
        <EmptyState message="Nothing has been added to your recipes list yet." />
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
