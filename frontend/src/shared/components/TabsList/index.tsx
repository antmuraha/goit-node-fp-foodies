import { NavLink } from "react-router-dom";
import { TabsListTab } from "./useTabsList";

type TabsListProps = {
  isOwnProfile: boolean;
};

const TabsList = (props: TabsListProps) => {
  const { isOwnProfile } = props;

  return (
    <nav>
      <ul>
        <NavLink to={`?tab=${TabsListTab.RECIPES}`}>{isOwnProfile ? "My recipes" : "Recipes"}</NavLink>
        {isOwnProfile && (
          <NavLink to={`?tab=${TabsListTab.FAVORITES}`}>{isOwnProfile ? "My favorites" : "Favorites"}</NavLink>
        )}
        <NavLink to={`?tab=${TabsListTab.FOLLOWERS}`}>Followers</NavLink>
        {isOwnProfile && <NavLink to={`?tab=${TabsListTab.FOLLOWING}`}>Following</NavLink>}
      </ul>
    </nav>
  );
};

export default TabsList;
