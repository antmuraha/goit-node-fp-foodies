import { useCallback, useEffect } from "react";
import type { UserListQuery } from "../../entities/user";
import { fetchProfile } from "../../store/slices/authSlice";
import { fetchProfileFollowers, fetchProfileFollowing } from "../../store/slices/followersSlice";
import { fetchFavoriteRecipes } from "../../store/slices/recipesSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

type ProfileCollectionQuery = UserListQuery;

export const useDataProfile = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.currentUser);
  const status = useAppSelector((state) => state.auth.profileStatus);
  const error = useAppSelector((state) => state.auth.profileError);

  const refreshProfile = useCallback(() => {
    void dispatch(fetchProfile());
  }, [dispatch]);

  return {
    profile,
    isLoading: status === "loading",
    error,
    refreshProfile,
  };
};

export const useDataProfileFavorites = (query?: ProfileCollectionQuery) => {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));
  const recipes = useAppSelector((state) => state.recipes.favoriteRecipes.data);
  const total = useAppSelector((state) => state.recipes.favoriteRecipes.total);
  const status = useAppSelector((state) => state.recipes.favoriteRecipes.status);
  const error = useAppSelector((state) => state.recipes.favoriteRecipes.error);

  const loadFavorites = useCallback(() => {
    if (!hasToken) {
      return;
    }

    void dispatch(fetchFavoriteRecipes(query));
  }, [dispatch, hasToken, query]);

  useEffect(() => {
    if (hasToken && status === "idle") {
      loadFavorites();
    }
  }, [hasToken, loadFavorites, status]);

  return {
    data: recipes,
    total,
    isLoading: hasToken && status === "loading",
    error,
    loadFavorites,
  };
};

export const useDataProfileFollowers = (id: number | string, query?: ProfileCollectionQuery) => {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));
  const users = useAppSelector((state) => state.followers.followers.data);
  const total = useAppSelector((state) => state.followers.followers.total);
  const status = useAppSelector((state) => state.followers.followers.status);
  const error = useAppSelector((state) => state.followers.followers.error);

  const loadFollowers = useCallback(() => {
    if (!hasToken) {
      return;
    }

    void dispatch(fetchProfileFollowers({ id, query }));
  }, [dispatch, hasToken, id, query]);

  useEffect(() => {
    if (hasToken && status === "idle") {
      loadFollowers();
    }
  }, [hasToken, loadFollowers, status]);

  return {
    data: users,
    total,
    isLoading: hasToken && status === "loading",
    error,
    loadFollowers,
  };
};

export const useDataProfileFollowing = (query?: ProfileCollectionQuery) => {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));
  const users = useAppSelector((state) => state.followers.following.data);
  const total = useAppSelector((state) => state.followers.following.total);
  const status = useAppSelector((state) => state.followers.following.status);
  const error = useAppSelector((state) => state.followers.following.error);

  const loadFollowing = useCallback(() => {
    if (!hasToken) {
      return;
    }

    void dispatch(fetchProfileFollowing(query));
  }, [dispatch, hasToken, query]);

  useEffect(() => {
    if (hasToken && status === "idle") {
      loadFollowing();
    }
  }, [hasToken, loadFollowing, status]);

  return {
    data: users,
    total,
    isLoading: hasToken && status === "loading",
    error,
    loadFollowing,
  };
};
