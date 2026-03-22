import type { ReactElement } from "react";
import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { TabsListTab } from "../../../shared/components/TabsList/useTabsList";
import UserRecipesList from "../../../shared/components/UserRecipesList";
import MyFavoritesList from "../../../shared/components/MyFavoritesList";
import UserFollowersList from "../../../shared/components/UserFollowersList";
import FollowingList from "../../../shared/components/FollowingList";
import { Pagination } from "../../../shared/ui/pagination";
import { useDataUserRecipes } from "../../../shared/hooks/useDataUsers";
import { scrollTo } from "../../../shared/hooks/useScrollToTop";
import {
  useDataProfileFavorites,
  useDataProfileFollowers,
  useDataProfileFollowing,
} from "../../../shared/hooks/useDataProfile";
import styles from "./ProfileContentList.module.css";

const PAGE_SIZE = 9;

interface ProfileContentListProps {
  userId: number;
  isOwnProfile: boolean;
}

export const ProfileContentList = ({ userId, isOwnProfile }: ProfileContentListProps): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = (searchParams.get("tab") ?? TabsListTab.RECIPES) as TabsListTab;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const query = useMemo(() => ({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }), [page]); // (3-1)*9 -> start from 19

  const recipes = useDataUserRecipes(userId, query);
  const favorites = useDataProfileFavorites(query);
  const followers = useDataProfileFollowers(userId, query);
  const following = useDataProfileFollowing(query);

  const activeData =
    {
      [TabsListTab.RECIPES]: recipes,
      [TabsListTab.FAVORITES]: favorites,
      [TabsListTab.FOLLOWERS]: followers,
      [TabsListTab.FOLLOWING]: following,
    }[tab] ?? recipes;

  const totalPages = Math.ceil((activeData.total ?? 0) / PAGE_SIZE);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    switch (tab) {
      case TabsListTab.RECIPES:
        recipes.loadOwnRecipes();
        break;
      case TabsListTab.FAVORITES:
        if (isOwnProfile) favorites.loadFavorites();
        break;
      case TabsListTab.FOLLOWERS:
        followers.loadFollowers();
        break;
      case TabsListTab.FOLLOWING:
        if (isOwnProfile) following.loadFollowing();
        break;
    }
  }, [userId, tab, page]);

  const handlePageChange = (newPage: number): void => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
    scrollTo("#content-list", 200);
  };

  return (
    <div className={styles.wrapper}>
      {activeData.isLoading && <p className={styles.loading}>Loading Content List...</p>}
      {activeData.error && <p className={styles.error}>{activeData.error}</p>}

      {!activeData.isLoading && (
        <div className={styles.contentList}>
          {tab === TabsListTab.RECIPES && <UserRecipesList user={String(userId)} />}
          {tab === TabsListTab.FAVORITES && isOwnProfile && <MyFavoritesList />}
          {tab === TabsListTab.FOLLOWERS && <UserFollowersList user={String(userId)} />}
          {tab === TabsListTab.FOLLOWING && isOwnProfile && <FollowingList />}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};
