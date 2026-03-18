import type { ReactNode } from "react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useDataUser } from "../../shared/hooks";
import UserInfo from "../../shared/components/UserInfo";
import TabsList from "../../shared/components/TabsList";
import { TabsListTab, useTabsList } from "../../shared/components/TabsList/useTabsList";
import MyFavoritesList from "../../shared/components/MyFavoritesList";
import FollowingList from "../../shared/components/FollowingList";
import { APP_ROUTES } from "../../shared/constants/routes";
import UserRecipesList from "../../shared/components/UserRecipesList";
import UserFollowersList from "../../shared/components/UserFollowersList";
import { ProfileTabsNavigation } from "../../entities/user/index";

export const UserPage = (): ReactNode => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (!currentUser || !userId || !user || !id) {
    console.warn("User not found or invalid ID", { userId, user, currentUser });
    navigate(APP_ROUTES.NOT_FOUND);
    return null;
  }

  const isOwnProfile = user.id === currentUser.id;

  const { content } = useTabsList(
    isOwnProfile
      ? [TabsListTab.RECIPES, TabsListTab.FAVORITES, TabsListTab.FOLLOWERS, TabsListTab.FOLLOWING]
      : [TabsListTab.RECIPES, TabsListTab.FOLLOWERS],
    isOwnProfile
      ? [
          <UserRecipesList key={id} user={id} />,
          <MyFavoritesList />,
          <UserFollowersList key={id} user={id} />,
          <FollowingList />,
        ]
      : [<UserRecipesList key={id} user={id} />, <UserFollowersList key={id} user={id} />],
  );

  return (
    <main>
      <h1>User page</h1>
      <aside>
        <UserInfo
          key={id}
          isOwnProfile={isOwnProfile}
          user={user}
          favoritesCount={currentUser.favoritesCount}
          followingCount={currentUser.followingCount}
        />
        {/* <TabsList isOwnProfile={isOwnProfile} /> */}
        <ProfileTabsNavigation isOwnProfile={isOwnProfile} />
        {content}
      </aside>
      {isLoading && <p>Loading user profile...</p>}
      {error && <p>User error: {error}</p>}
    </main>
  );
};
