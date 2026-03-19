import { useEffect } from "react";
import { UserDetailsResponse } from "../../../entities/user/model/types";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { Button, ImageInput } from "../../ui";
import { useAuth } from "../../hooks/useAuth";
import { useDataUser } from "../../hooks/useDataUser";
import { Icon } from "../../../shared/components/Icon";
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
  const { uploadAvatar, isAvatarUpdating, avatarUpdateError } = useDataUser();

  const handleAvatarSelect = (file: File | null): void => {
    if (!file) {
      return;
    }

    void uploadAvatar(file);
  };

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
          <ImageInput
            id="profile-avatar-file"
            label=""
            initialImageUrl={user.avatar ?? undefined}
            accept="image/*"
            disabled={isOwnProfile ? isAvatarUpdating : true}
            onFileSelect={handleAvatarSelect}
            hasError={isOwnProfile && Boolean(avatarUpdateError)}
            error={isOwnProfile ? (avatarUpdateError ?? undefined) : undefined}
            targetHeight={256}
            targetWidth={256}
            elementTrigger={
              isOwnProfile ? (
                <Button
                  variant="primary"
                  size="small"
                  isIconOnly
                  className={styles.uploadBtn}
                  aria-label="Upload new avatar"
                  disabled={isAvatarUpdating}
                >
                  <div className={styles.iconWrapper}>
                    <Icon name="close" color="action-secondary-bg" size={24} />
                  </div>
                </Button>
              ) : (
                false
              )
            }
          />
        </div>

        <h2 className={styles.userName}>{user.name}</h2>

        <ul className={styles.statsList}>
          <li>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </li>
          <li>
            <span className={styles.label}>Added recipes:</span>
            <span className={styles.value}>{user.recipesCreated}</span>
          </li>

          {isOwnProfile && (
            <li>
              <span className={styles.label}>Favorites:</span>
              <span className={styles.value}>{favoritesCount}</span>
            </li>
          )}

          <li>
            <span className={styles.label}>Followers:</span>
            <span className={styles.value}>{user.followersCount}</span>
          </li>

          {isOwnProfile && (
            <li>
              <span className={styles.label}>Following:</span>
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