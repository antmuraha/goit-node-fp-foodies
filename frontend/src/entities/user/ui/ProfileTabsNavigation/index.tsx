import { NavLink } from "react-router-dom";
import { TabsListTab } from "../../../../shared/components/TabsList/useTabsList"; 
import styles from "./ProfileTabsNavigation.module.css";

type Props = {
  isOwnProfile: boolean;
};

export const ProfileTabsNavigation = ({ isOwnProfile }: Props) => {
  const tabs = [
    { id: TabsListTab.RECIPES, label: isOwnProfile ? "MY RECIPES" : "RECIPES" },
    ...(isOwnProfile ? [{ id: TabsListTab.FAVORITES, label: "MY FAVORITES" }] : []),
    { id: TabsListTab.FOLLOWERS, label: "FOLLOWERS" },
    ...(isOwnProfile ? [{ id: TabsListTab.FOLLOWING, label: "FOLLOWING" }] : []),
  ];

  return (
    <nav className={styles.section}>
      <ul className={styles.tabsList}>
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.tabItem}>
            <NavLink
              to={`?tab=${tab.id}`}
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              {tab.label}
              <span className={styles.indicator} />
            </NavLink>
          </li>
        ))}
      </ul>
      <div className={styles.bottomLine} />
    </nav>
  );
};