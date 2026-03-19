import { NavLink } from "react-router-dom";
import { useDataProfileFollowers } from "../../hooks";
import { EmptyState } from "../../ui";

type UserFollowersListProps = {
  user: string;
};

const UserFollowersList = ({ user }: UserFollowersListProps) => {
  const { data } = useDataProfileFollowers(user);

  return (
    <div>
      <h2>Followers</h2>
      {data.length === 0 ? (
        <EmptyState message="There are currently no followers on your account." />
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
