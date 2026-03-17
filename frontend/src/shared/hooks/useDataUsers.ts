import { useCallback, useEffect } from "react";
import { fetchUsers } from "../../store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchUserRecipes } from "../../store/slices/recipesSlice";
import { UserListQuery } from "../../entities/user";

type ProfileCollectionQuery = UserListQuery;

export const useDataUsers = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const status = useAppSelector((state) => state.users.listStatus);
  const error = useAppSelector((state) => state.users.listError);

  const loadUsers = useCallback(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      loadUsers();
    }
  }, [loadUsers, status]);

  return {
    users,
    isLoading: status === "loading",
    error,
    loadUsers,
  };
};

export const useDataUserRecipes = (id: number | string, query?: ProfileCollectionQuery) => {
  const dispatch = useAppDispatch();
  const hasToken = useAppSelector((state) => Boolean(state.auth.token));
  const recipes = useAppSelector((state) => state.recipes.ownRecipes.data);
  const total = useAppSelector((state) => state.recipes.ownRecipes.total);
  const status = useAppSelector((state) => state.recipes.ownRecipes.status);
  const error = useAppSelector((state) => state.recipes.ownRecipes.error);

  const loadOwnRecipes = useCallback(() => {
    if (!hasToken) {
      return;
    }

    void dispatch(fetchUserRecipes({ id, query }));
  }, [dispatch, hasToken, id, query]);

  useEffect(() => {
    if (hasToken && status === "idle") {
      loadOwnRecipes();
    }
  }, [hasToken, loadOwnRecipes, status]);

  return {
    data: recipes,
    total,
    isLoading: hasToken && status === "loading",
    error,
    loadOwnRecipes,
  };
};
