import type { ReactElement } from "react";
import { AppRouter } from "./AppRouter";
import { ItemCard } from "../shared/ui/item-card/ItemCard"; // Перевір шлях!

export const App = (): ReactElement => {
  return (
    <>
      <ItemCard
        id="1"
        title="FLAMICHE"
        description="For the pastry, sift the flour and salt into the bowl..."
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4xTp7oz_juVHSX8bdoBXifBz23rm4ffTKAA&s"
        isFavorite={true}
        author={{
          id: "user-123",
          name: "Victoria",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg"
        }}
        onFavoriteClick={(id) => console.log("Toggle favorite for:", id)}
        onAuthorClick={(authId) => console.log("Go to profile:", authId)}
        onDetailsClick={(id) => console.log("Go to recipe page:", id)}
      />
      {/* Роутер залишаємо знизу, або тимчасово коментуємо */}
      <AppRouter />
    </>
  );
};
