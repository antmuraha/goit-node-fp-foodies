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

export const AppRouter = (): ReactElement => {
  return (
    <Routes>
      <Route element={<SharedLayout />}>
        <Route index element={<HomePage />} />
        <Route path={APP_ROUTES.RECIPE_DETAILS} element={<RecipePage />} />
        <Route path={APP_ROUTES.RECIPE_ADD} element={<AddRecipePage />} />
        <Route path={APP_ROUTES.USER} element={<UserPage />} />
        <Route path={APP_ROUTES.UI_KIT} element={<UiKitPage />} />
        <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.NOT_FOUND} replace />} />
      </Route>
    </Routes>
  );
};
