import { useDataProfileFavorites } from "../../hooks";
import { EmptyState } from "../../ui";
import { ProfileRecipeCard } from "../../ui/profile-recipe-card";

const MyFavoritesList = () => {
  const { data } = useDataProfileFavorites();

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
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFavoritesList;
