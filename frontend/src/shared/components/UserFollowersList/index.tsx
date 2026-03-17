import { NavLink } from "react-router-dom";
import { useDataProfileFollowers } from "../../hooks";
import { useEffect } from "react";

type UserFollowersListProps = {
  user: string;
};

const UserFollowersList = ({ user }: UserFollowersListProps) => {
  const { data, loadFollowers } = useDataProfileFollowers(user);

  useEffect(() => {
    loadFollowers();
  }, [loadFollowers]);

  return (
    <div>
      <h2>Followers</h2>
      {data.length === 0 ? (
        <p>You have no followers yet.</p>
      ) : (
        <ul>
          {data.map((user) => (
            <NavLink to={`/user/${user.id}`} key={user.id}>
              <li>{user.name}</li>
            </NavLink>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserFollowersList;
