import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { usersReducer } from "./slices/usersSlice";
import { recipesReducer } from "./slices/recipesSlice";
import { categoriesReducer } from "./slices/categoriesSlice";
import { ingredientsReducer } from "./slices/ingredientsSlice";
import { areasReducer } from "./slices/areasSlice";
import { testimonialsReducer } from "./slices/testimonialsSlice";
import { favoritesReducer } from "./slices/favoritesSlice";
import { followersReducer } from "./slices/followersSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  recipes: recipesReducer,
  categories: categoriesReducer,
  ingredients: ingredientsReducer,
  areas: areasReducer,
  testimonials: testimonialsReducer,
  favorites: favoritesReducer,
  followers: followersReducer,
});
