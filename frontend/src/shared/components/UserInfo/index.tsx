import { UserDetailsResponse } from "../../../entities/user/model/types";

type UserInfoProps = {
  isOwnProfile: boolean;
  user: UserDetailsResponse;
  favoritesCount: number;
  followingCount: number;
};

const UserInfo = (props: UserInfoProps) => {
  const { isOwnProfile } = props;

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
    </div>
  );
};

export default UserInfo;
