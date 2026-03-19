import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { recipesApi } from "../../api/endpoints/recipesApi";
import type {
  CreateRecipePayload,
  RecipeDetails,
  RecipeSearchParams,
  RecipeSummary,
  UpdateRecipePayload,
} from "../../entities/recipe/types";
import type { ApiError, AsyncStatus } from "../../shared/types/api";

type RecipeListState = {
  data: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
  status: AsyncStatus;
  error: string | null;
};

type AuthTokenState = {
  auth: {
    token: string | null;
  };
};

type RecipesState = {
  list: RecipeSummary[];
  total: number;
  limit: number;
  offset: number;
  selectedRecipe: RecipeDetails | null;
  listStatus: AsyncStatus;
  selectedRecipeStatus: AsyncStatus;
  listError: string | null;
  selectedRecipeError: string | null;
  popularList: RecipeSummary[];
  popularPage: number;
  popularLimit: number;
  popularListStatus: AsyncStatus;
  popularListError: string | null;
  ownRecipes: RecipeListState;
  favoriteRecipes: RecipeListState;
  editorSubmitStatus: AsyncStatus;
  editorSubmitError: string | null;
};

const initialRecipeListState: RecipeListState = {
  data: [],
  total: 0,
  limit: 0,
  offset: 0,
  status: "idle",
  error: null,
};

const initialState: RecipesState = {
  list: [],
  total: 0,
  limit: 0,
  offset: 0,
  selectedRecipe: null,
  listStatus: "idle",
  selectedRecipeStatus: "idle",
  listError: null,
  selectedRecipeError: null,
  popularList: [],
  popularPage: 0,
  popularLimit: 0,
  popularListStatus: "idle",
  popularListError: null,
  ownRecipes: { ...initialRecipeListState },
  favoriteRecipes: { ...initialRecipeListState },
  editorSubmitStatus: "idle",
  editorSubmitError: null,
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Unexpected recipes request error";
};

export const fetchRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  RecipeSearchParams | undefined,
  { rejectValue: string }
>("recipes/fetchRecipes", async (query, thunkApi) => {
  try {
    return await recipesApi.getRecipes(query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchRecipeById = createAsyncThunk<RecipeDetails, number, { rejectValue: string }>(
  "recipes/fetchRecipeById",
  async (id, thunkApi) => {
    try {
      return await recipesApi.getRecipeById(id);
    } catch (error) {
      return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
    }
  },
);

export const fetchPopularRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  void,
  { rejectValue: string }
>("recipes/fetchPopularRecipes", async (_, thunkApi) => {
  try {
    return await recipesApi.getPopularRecipes();
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchUserRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  { id: number | string; query?: Pick<RecipeSearchParams, "limit" | "offset"> },
  { state: AuthTokenState; rejectValue: string }
>("recipes/fetchUserRecipes", async ({ id, query }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue("Missing auth token for own recipes request");
  }

  try {
    return await recipesApi.getUserRecipes(token, id, query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const fetchFavoriteRecipes = createAsyncThunk<
  { data: RecipeSummary[]; total: number; limit: number; offset: number },
  Pick<RecipeSearchParams, "limit" | "offset"> | undefined,
  { state: AuthTokenState; rejectValue: string }
>("recipes/fetchFavoriteRecipes", async (query, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue("Missing auth token for favorite recipes request");
  }

  try {
    return await recipesApi.getFavorites(token, query);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const createRecipe = createAsyncThunk<
  RecipeDetails,
  CreateRecipePayload,
  { state: AuthTokenState; rejectValue: string }
>("recipes/createRecipe", async (payload, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue("Missing auth token for recipe create request");
  }

  try {
    return await recipesApi.createRecipe(token, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

export const updateRecipe = createAsyncThunk<
  RecipeDetails,
  { id: number; payload: UpdateRecipePayload },
  { state: AuthTokenState; rejectValue: string }
>("recipes/updateRecipe", async ({ id, payload }, thunkApi) => {
  const token = thunkApi.getState().auth.token;

  if (!token) {
    return thunkApi.rejectWithValue("Missing auth token for recipe update request");
  }

  try {
    return await recipesApi.updateRecipe(token, id, payload);
  } catch (error) {
    return thunkApi.rejectWithValue(getErrorMessage(error as ApiError));
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
      state.selectedRecipeStatus = "idle";
      state.selectedRecipeError = null;
    },
    optimisticAddFavorite: (state, action: PayloadAction<{ recipe: RecipeSummary }>) => {
      const exists = state.favoriteRecipes.data.some((r) => r.id === action.payload.recipe.id);

      if (exists) {
        return;
      }

      state.favoriteRecipes.data.unshift(action.payload.recipe);
      state.favoriteRecipes.total += 1;
    },
    optimisticRemoveFavorite: (state, action: PayloadAction<{ recipeId: number | string }>) => {
      const previousLength = state.favoriteRecipes.data.length;
      state.favoriteRecipes.data = state.favoriteRecipes.data.filter(
        (r) => String(r.id) !== String(action.payload.recipeId),
      );

      if (state.favoriteRecipes.data.length !== previousLength) {
        state.favoriteRecipes.total = Math.max(0, state.favoriteRecipes.total - 1);
      }
    },
    rollbackAddFavorite: (state, action: PayloadAction<{ recipeId: number | string }>) => {
      const previousLength = state.favoriteRecipes.data.length;
      state.favoriteRecipes.data = state.favoriteRecipes.data.filter(
        (r) => String(r.id) !== String(action.payload.recipeId),
      );

      if (state.favoriteRecipes.data.length !== previousLength) {
        state.favoriteRecipes.total = Math.max(0, state.favoriteRecipes.total - 1);
      }
    },
    rollbackRemoveFavorite: (state, action: PayloadAction<{ recipe: RecipeSummary }>) => {
      const exists = state.favoriteRecipes.data.some((r) => r.id === action.payload.recipe.id);

      if (exists) {
        return;
      }

      state.favoriteRecipes.data.unshift(action.payload.recipe);
      state.favoriteRecipes.total += 1;
    },
    resetEditorSubmitState: (state) => {
      state.editorSubmitStatus = "idle";
      state.editorSubmitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload.data;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.offset = action.payload.offset;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload ?? "Unable to load recipes";
      })
      .addCase(fetchRecipeById.pending, (state) => {
        state.selectedRecipeStatus = "loading";
        state.selectedRecipeError = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.selectedRecipeStatus = "succeeded";
        state.selectedRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.selectedRecipeStatus = "failed";
        state.selectedRecipeError = action.payload ?? "Unable to load recipe";
      })
      .addCase(fetchPopularRecipes.pending, (state) => {
        state.popularListStatus = "loading";
        state.popularListError = null;
      })
      .addCase(fetchPopularRecipes.fulfilled, (state, action) => {
        state.popularListStatus = "succeeded";
        state.popularList = action.payload.data;
        state.popularPage = action.payload.offset / action.payload.limit;
        state.popularLimit = action.payload.limit;
      })
      .addCase(fetchPopularRecipes.rejected, (state, action) => {
        state.popularListStatus = "failed";
        state.popularListError = typeof action.payload === "string" ? action.payload : "Unable to load popular recipes";
      })
      .addCase(fetchUserRecipes.pending, (state) => {
        state.ownRecipes.status = "loading";
        state.ownRecipes.error = null;
      })
      .addCase(fetchUserRecipes.fulfilled, (state, action) => {
        state.ownRecipes.status = "succeeded";
        state.ownRecipes.data = action.payload.data;
        state.ownRecipes.total = action.payload.total;
        state.ownRecipes.limit = action.payload.limit;
        state.ownRecipes.offset = action.payload.offset;
      })
      .addCase(fetchUserRecipes.rejected, (state, action) => {
        state.ownRecipes.status = "failed";
        state.ownRecipes.error = action.payload ?? "Unable to load user recipes";
      })
      .addCase(fetchFavoriteRecipes.pending, (state) => {
        state.favoriteRecipes.status = "loading";
        state.favoriteRecipes.error = null;
      })
      .addCase(fetchFavoriteRecipes.fulfilled, (state, action) => {
        state.favoriteRecipes.status = "succeeded";
        state.favoriteRecipes.data = action.payload.data;
        state.favoriteRecipes.total = action.payload.total;
        state.favoriteRecipes.limit = action.payload.limit;
        state.favoriteRecipes.offset = action.payload.offset;
      })
      .addCase(fetchFavoriteRecipes.rejected, (state, action) => {
        state.favoriteRecipes.status = "failed";
        state.favoriteRecipes.error = action.payload ?? "Unable to load favorite recipes";
      })
      .addCase(createRecipe.pending, (state) => {
        state.editorSubmitStatus = "loading";
        state.editorSubmitError = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.editorSubmitStatus = "succeeded";
        state.selectedRecipe = action.payload;
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.editorSubmitStatus = "failed";
        state.editorSubmitError = action.payload ?? "Unable to create recipe";
      })
      .addCase(updateRecipe.pending, (state) => {
        state.editorSubmitStatus = "loading";
        state.editorSubmitError = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.editorSubmitStatus = "succeeded";
        state.selectedRecipe = action.payload;

        state.list = state.list.map((recipeItem) =>
          recipeItem.id === action.payload.id ? { ...recipeItem, ...action.payload } : recipeItem,
        );

        state.ownRecipes.data = state.ownRecipes.data.map((recipeItem) =>
          recipeItem.id === action.payload.id ? { ...recipeItem, ...action.payload } : recipeItem,
        );

        state.favoriteRecipes.data = state.favoriteRecipes.data.map((recipeItem) =>
          recipeItem.id === action.payload.id ? { ...recipeItem, ...action.payload } : recipeItem,
        );
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.editorSubmitStatus = "failed";
        state.editorSubmitError = action.payload ?? "Unable to update recipe";
      });
  },
});

export const {
  clearSelectedRecipe,
  optimisticAddFavorite,
  optimisticRemoveFavorite,
  rollbackAddFavorite,
  rollbackRemoveFavorite,
  resetEditorSubmitState,
} = recipesSlice.actions;
export const recipesReducer = recipesSlice.reducer;
