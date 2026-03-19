import { NavLink, useSearchParams } from "react-router-dom";
import { TabsListTab } from "../../../../shared/components/TabsList/useTabsList";
import styles from "./ProfileTabsNavigation.module.css";
import { useEffect } from "react";

type Props = {
  isOwnProfile: boolean;
};

export const ProfileTabsNavigation = ({ isOwnProfile }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!tab) {
      setSearchParams({ tab: "recipes" }, { replace: true });
    }
  }, [tab, setSearchParams]);

  const tabs = [
    { id: TabsListTab.RECIPES, label: isOwnProfile ? "MY RECIPES" : "RECIPES" },
    ...(isOwnProfile ? [{ id: TabsListTab.FAVORITES, label: "MY FAVORITES" }] : []),
    { id: TabsListTab.FOLLOWERS, label: "FOLLOWERS" },
    ...(isOwnProfile ? [{ id: TabsListTab.FOLLOWING, label: "FOLLOWING" }] : []),
  ];

  return (
    <nav className={styles.section} aria-label="Profile tabs">
      <ul className={styles.tabsList}>
        {tabs.map((tabItem) => (
          <li key={tabItem.id} className={styles.tabItem}>
            <NavLink
              to={`?tab=${tabItem.id}`}
              className={tab === tabItem.id ? `${styles.link} ${styles.active}` : styles.link}
            >
              <span className={styles.labelText}>{tabItem.label}</span>
            </NavLink>
          </li>
        ))}
        <div className={styles.bottomLine} />
      </ul>
    </nav>
  );
};
