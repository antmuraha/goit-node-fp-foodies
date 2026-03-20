import { useDataProfileFavorites } from "../../hooks";
import { EmptyState } from "../../ui";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";
import { useUserFavorites } from "../../helpers/useUserFavorites";

const MyFavoritesList = () => {
  const { data } = useDataProfileFavorites();
  const { toggleFavorite, isPending } = useUserFavorites();

  return (
    <div>
      {data.length === 0 ? (
        <EmptyState message="Nothing has been added to your favorite recipes list yet." />
      ) : (
        <ul>
          {data.map((recipe) => (
            <ProfileRecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              instructions={recipe.instructions}
              image={recipe.image}
              onDelete={() => { void toggleFavorite(recipe.id, true); }}
              isDeleting={isPending(recipe.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFavoritesList;
