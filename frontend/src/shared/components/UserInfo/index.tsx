import { useEffect } from "react";
import { UserDetailsResponse } from "../../../entities/user/model/types";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { Button } from "../../ui";

type UserInfoProps = {
  isOwnProfile: boolean;
  user: UserDetailsResponse;
  favoritesCount: number;
  followingCount: number;
};

const UserInfo = (props: UserInfoProps) => {
  const { isOwnProfile, user } = props;
  const { ensureFollowingStatus, isFollowing, isPending, toggleFollowing } = useUserFollowing();

  useEffect(() => {
    if (isOwnProfile) {
      return;
    }

    void ensureFollowingStatus(user.id);
  }, [ensureFollowingStatus, isOwnProfile, user.id]);

  return (
    <div>
      <div>UserInfo</div>
      <div>Is own profile: {isOwnProfile ? "Yes" : "No"}</div>
      <div>Name: {props.user.name}</div>
      <div>Email: {props.user.email}</div>
      <div>Avatar: {props.user.avatar}</div>
      <div>Followers: {props.user.followersCount}</div>
      <div>Recipes Created: {props.user.recipesCreated}</div>
      {isOwnProfile && (
        <>
          <p>Favorites count: {props.favoritesCount}</p>
          <p>Following count: {props.followingCount}</p>
        </>
      )}
      {isOwnProfile ? (
        <Button onClick={() => alert("TODO: Not yet implemented")}>Log Out</Button>
      ) : (
        <Button
          disabled={isPending(user.id)}
          onClick={() => {
            void toggleFollowing(user.id);
          }}
        >
          {isFollowing(user.id) ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default UserInfo;
