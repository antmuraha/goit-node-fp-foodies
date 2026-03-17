import { NavLink } from "react-router-dom";
import { useDataProfileFavorites } from "../../hooks";
import { Button } from "../../ui";
import { useUserFavorites } from "../../helpers/useUserFavorites";

const MyFavoritesList = () => {
  const { data } = useDataProfileFavorites();
  const { isFavorite, isPending, toggleFavorite } = useUserFavorites();

  return (
    <div>
      <h2>My Favorites</h2>
      {data.length === 0 ? (
        <p>You have no favorite recipes yet.</p>
      ) : (
        <ul>
          {data.map((recipe) => (
            <li key={recipe.id}>
              <Button
                disabled={isPending(recipe.id)}
                onClick={() => {
                  void toggleFavorite(recipe.id);
                }}
              >
                {isFavorite(recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
              <NavLink to={`/recipe/${recipe.id}`} key={recipe.id}>
                {recipe.title}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyFavoritesList;
