import { useDataProfileFollowers } from "../../hooks";
import { EmptyState } from "../../ui";
import { ProfileFollowerCard } from "../../ui/profile-follower-card";

type UserFollowersListProps = {
  user: string;
};

const UserFollowersList = ({ user }: UserFollowersListProps) => {
  const { data } = useDataProfileFollowers(user);

  return (
    <div>
      {data.length === 0 ? (
        <EmptyState message="There are currently no followers on your account." />
      ) : (
        <ul>
          {data.map((user) => (
            <ProfileFollowerCard key={user.id} id={user.id} name={user.name} avatar={user.avatar} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFollowersList;
