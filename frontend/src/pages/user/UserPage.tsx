import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useDataUser } from "../../shared/hooks";
import UserInfo from "../../shared/components/UserInfo";
import { APP_ROUTES } from "../../shared/constants/routes";
import { ProfileTabsNavigation } from "../../entities/user/index";
import { ProfileContentList } from "../../features/profile/profile-content-list";
import styles from "./UserPage.module.css";

export const UserPage = (): ReactNode => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);
  const { currentUser } = useAuth();
  const { user, isLoading, error } = useDataUser(userId);

  if (isLoading) {
    return (
      <main>
        <p>Loading user profile...</p>
      </main>
    );
  }

  if (!currentUser || !id || !userId || !user) {
    console.warn("User not found or invalid ID", { userId, user, currentUser });
    navigate(APP_ROUTES.NOT_FOUND);
    return null;
  }

  const isOwnProfile = user.id === currentUser.id;

  return (
    <main>
      <aside className={styles.wrapper}>
        <div className={styles.profile}>
          <h2 className={styles.title}>Profile</h2>
          <p className={styles.text}>
            Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.
          </p>
        </div>
        <div className={styles.userInfoWrapper}>
          <UserInfo
            key={id}
            isOwnProfile={isOwnProfile}
            user={user}
            favoritesCount={currentUser.favoritesCount}
            followingCount={currentUser.followingCount}
          />
          <div id="content-list" className={styles.listInfo}>
            <ProfileTabsNavigation isOwnProfile={isOwnProfile} />
            <ProfileContentList userId={userId} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </aside>
      {isLoading && <p>Loading user profile...</p>}
      {error && <p>User error: {error}</p>}
    </main>
  );
};
