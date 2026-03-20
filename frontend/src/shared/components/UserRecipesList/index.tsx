import { useDataUserRecipes } from "../../hooks/useDataUsers";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";
import { EmptyState } from "../../ui";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteRecipe } from "../../../store/slices/recipesSlice";
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
                  ? () => {
                      void dispatch(deleteRecipe(recipe.id));
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
