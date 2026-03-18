import { useEffect } from "react";
import { UserDetailsResponse } from "../../../entities/user/model/types";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { Button } from "../../ui";
import { useAuth } from "../../hooks/useAuth";
import styles from "./UserInfo.module.css";

type UserInfoProps = {
  isOwnProfile: boolean;
  user: UserDetailsResponse;
  favoritesCount: number;
  followingCount: number;
};

const UserInfo = (props: UserInfoProps) => {
  const { isOwnProfile, user, favoritesCount, followingCount } = props;
  const { ensureFollowingStatus, isFollowing, isPending, toggleFollowing } = useUserFollowing();
  const { signOut } = useAuth();

  useEffect(() => {
    if (isOwnProfile) {
      return;
    }

    void ensureFollowingStatus(user.id);
  }, [ensureFollowingStatus, isOwnProfile, user.id]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        
        <div className={styles.avatarContainer}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>{user.name?.[0]?.toUpperCase() || "U"}</div>
          )}
          
          {isOwnProfile && (
            <button 
              className={styles.uploadBtn} 
              aria-label="Upload new avatar"
              type="button"
              onClick={() => {alert("add this functional")}}
            >
              ?
            </button>
          )}
        </div>

        <h2 className={styles.userName}>{user.name}</h2>

        <ul className={styles.statsList}>
          <li>
            <span className={styles.label}>Email: </span> 
            <span className={styles.value}>{user.email}</span>
          </li>
          <li>
            <span className={styles.label}>Added recipes: </span> 
            <span className={styles.value}>{user.recipesCreated}</span>
          </li>
      
          {isOwnProfile && (
            <li>
              <span className={styles.label}>Favorites: </span> 
              <span className={styles.value}>{favoritesCount}</span>
            </li>
          )}

          <li>
            <span className={styles.label}>Followers: </span> 
            <span className={styles.value}>{user.followersCount}</span>
          </li>

          {isOwnProfile && (
            <li>
              <span className={styles.label}>Following: </span> 
              <span className={styles.value}>{followingCount}</span>
            </li>
          )}
        </ul>
      </div>

      <div className={styles.actions}>
        {isOwnProfile ? (
          <Button className={styles.actionButton} onClick={signOut}>
            LOG OUT
          </Button>
        ) : (
          <Button
            className={styles.actionButton}
            disabled={isPending(user.id)}
            onClick={() => {
              void toggleFollowing(user.id);
            }}
          >
            {isFollowing(user.id) ? "UNFOLLOW" : "FOLLOW"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserInfo;