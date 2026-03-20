import { useDataProfileFollowing, } from "../../hooks";
import { EmptyState } from "../../ui";
import { ProfileFollowerCard } from "../../ui/profile-follower-card";


const FollowingList = () => {
  const { data } = useDataProfileFollowing();
  const total = 12; // TODO: backend -> return total

  return (
    <div>
      {data.length === 0 ? (
        <EmptyState message="Your account currently has no subscriptions to other users." />
      ) : (
        <ul>
          {data.map((user) => (
            <ProfileFollowerCard
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.avatar}
              recipesCounter={total} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingList;
