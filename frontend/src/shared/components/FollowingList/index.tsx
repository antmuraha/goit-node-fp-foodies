import { NavLink } from "react-router-dom";
import { useDataProfileFollowing } from "../../hooks";
import { Button } from "../../ui";
import { useUserFollowing } from "../../helpers/useUserFollowing";
import { EmptyState } from "../../ui";

const FollowingList = () => {
  const { data } = useDataProfileFollowing();
  const { isFollowing, isPending, toggleFollowing } = useUserFollowing();

  return (
    <div>
      <h2>Following</h2>
      {data.length === 0 ? (
        <EmptyState message="Your account currently has no subscriptions to other users." />
      ) : (
        <ul>
          {data.map((user) => (
            <li key={user.id}>
              <Button
                disabled={isPending(user.id)}
                onClick={() => {
                  void toggleFollowing(user.id);
                }}
              >
                {isFollowing(user.id) ? "Unfollow" : "Follow"}
              </Button>
              <NavLink to={`/user/${user.id}`} key={user.id}>
                {user.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingList;
