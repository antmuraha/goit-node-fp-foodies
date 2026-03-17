import { ReactNode } from "react";

export enum TabsListTab {
  RECIPES = "recipes",
  FAVORITES = "favorites",
  FOLLOWERS = "followers",
  FOLLOWING = "following",
}

export const useTabsList = (tabs: TabsListTab[], contents: ReactNode[]) => {
  const tab = new URLSearchParams(window.location.search).get("tab");

  if (!tab || !tabs.includes(tab as TabsListTab)) {
    return { tab: tabs[0], content: contents[0] };
  }

  return { tab, content: contents[tabs.indexOf(tab as TabsListTab)] };
};
