import { useDataUserRecipes } from "../../hooks/useDataUsers";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";
import { EmptyState } from "../../ui";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteRecipe } from "../../../store/slices/recipesSlice";
import { adjustRecipesCreatedCount } from "../../../store/slices/authSlice";
import { adjustSelectedUserRecipesCreatedCount } from "../../../store/slices/usersSlice";
import styles from "./UserRecipesList.module.css";

type UserRecipesListProps = {
  user: string;
};

const UserRecipesList = ({ user }: UserRecipesListProps) => {
  const { data } = useDataUserRecipes(user);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const isOwner = currentUser && String(currentUser.id) === String(user);

  return (
    <div>
      {data.length === 0 ? (
        <EmptyState message="Nothing has been added to your recipes list yet." />
      ) : (
        <ul className={styles.recipeList}>
          {data.map((recipe) => (
            <ProfileRecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              instructions={recipe.instructions}
              image={recipe.image}
              onDelete={
                isOwner
                  ? async () => {
                      const result = await dispatch(deleteRecipe(recipe.id));

                      if (!deleteRecipe.fulfilled.match(result) || !currentUser) {
                        return;
                      }

                      dispatch(adjustRecipesCreatedCount(-1));
                      dispatch(adjustSelectedUserRecipesCreatedCount({ userId: currentUser.id, delta: -1 }));
                    }
                  : undefined
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserRecipesList;
