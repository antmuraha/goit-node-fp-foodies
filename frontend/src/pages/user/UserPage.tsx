import type { ReactNode } from "react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth, useDataUser } from "../../shared/hooks";
import UserInfo from "../../shared/components/UserInfo";

export const UserPage = (): ReactNode => {
  const { id } = useParams();
  const userId = useMemo(() => {
    const numericId = Number(id);
    return Number.isInteger(numericId) && numericId > 0 ? numericId : undefined;
  }, [id]);

  const { currentUser } = useAuth();
  const { user, isLoading, error } = useDataUser(userId);

  if (isLoading) {
    return (
      <main>
        <p>Loading user profile...</p>
      </main>
    );
  }

  if (!currentUser || !userId || !user) {
    // navigate(APP_ROUTES.NOT_FOUND);
    console.warn("User not found or invalid ID", { userId, user, currentUser });
    return null;
  }

  const isOwnProfile = user.id === currentUser.id;

  return (
    <main>
      <h1>User page</h1>
      <UserInfo
        isOwnProfile={isOwnProfile}
        user={user}
        favoritesCount={currentUser.favoritesCount}
        followingCount={currentUser.followingCount}
      />
      {isLoading && <p>Loading user profile...</p>}
      {error && <p>User error: {error}</p>}
      {!isLoading && !error && user && (
        <section>
          <h2>{user.name}</h2>
          <p>ID: {user.id}</p>
        </section>
      )}
      {!isLoading && !error && !user && <p>No user selected.</p>}
    </main>
  );
};
