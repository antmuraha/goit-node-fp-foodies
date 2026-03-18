import type { ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "../shared/constants/routes";
import { SharedLayout } from "../widgets/layout/SharedLayout";
import { HomePage } from "../pages/home/HomePage";
import { RecipePage } from "../pages/recipe/RecipePage";
import { AddRecipePage } from "../pages/add-recipe/AddRecipePage";
import { UserPage } from "../pages/user/UserPage";
import { UiKitPage } from "../pages/ui-kit/UiKitPage";
import { NotFoundPage } from "../pages/not-found/NotFoundPage";
import { SignInPage } from "../pages/sign-in/SignInPage";
import AuthPage from "../shared/components/AuthPage";
import { CategoryPage } from "../pages/category/CategoryPage";

export const AppRouter = (): ReactElement => {
  return (
    <Routes>
      <Route element={<SharedLayout />}>
        <Route index element={<HomePage />} />
        <Route path={APP_ROUTES.CATEGORY} element={<CategoryPage />} />
        <Route path={APP_ROUTES.RECIPE_DETAILS} element={<RecipePage />} />
        <Route
          path={APP_ROUTES.RECIPE_ADD}
          element={
            <AuthPage>
              <AddRecipePage />
            </AuthPage>
          }
        />
        <Route
          path={APP_ROUTES.RECIPE_EDIT}
          element={
            <AuthPage>
              <AddRecipePage />
            </AuthPage>
          }
        />
        <Route
          path={APP_ROUTES.USER}
          element={
            <AuthPage>
              <UserPage />
            </AuthPage>
          }
        >
          <Route index element={<Navigate to="recipes" replace />} />
          <Route path="recipes" element={<div>Мої рецепти</div>} />
          <Route path="favorites" element={<div>Мої улюблені</div>} />
          <Route path="followers" element={<div>Підписники</div>} />
          <Route path="following" element={<div>Підписки</div>} />
        </Route>
        <Route path={APP_ROUTES.UI_KIT} element={<UiKitPage />} />
        <Route path={APP_ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.NOT_FOUND} replace />} />
      </Route>
    </Routes>
  );
};
