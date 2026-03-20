import { useDataUserRecipes } from "../../hooks/useDataUsers";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";
import { EmptyState } from "../../ui";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteRecipe } from "../../../store/slices/recipesSlice";

type UserRecipesListProps = {
  user: string;
};

const UserRecipesList = ({ user }: UserRecipesListProps) => {
  const { data } = useDataUserRecipes(user);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

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
              onDelete={() => { if (token) void dispatch(deleteRecipe(recipe.id)); }}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRecipesList;
