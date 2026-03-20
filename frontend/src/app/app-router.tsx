import { Navigate, createBrowserRouter } from "react-router-dom";
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
import { routeHandle } from "../shared/helpers/routeHandle";
import { CategoryPage } from "../pages/category/CategoryPage";

export const appRouter = createBrowserRouter([
  {
    element: <SharedLayout />,
    handle: routeHandle({ breadcrumb: { title: "Home" } }),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: APP_ROUTES.CATEGORY,
        element: <CategoryPage />,
        handle: routeHandle({}),
      },
      {
        path: APP_ROUTES.RECIPE_DETAILS,
        element: <RecipePage />,
        handle: routeHandle({ breadcrumb: { title: "Recipe Details" } }),
      },
      {
        path: APP_ROUTES.RECIPE_ADD,
        element: (
          <AuthPage>
            <AddRecipePage />
          </AuthPage>
        ),
        handle: routeHandle({ breadcrumb: { title: "Add Recipe" } }),
      },
      {
        path: APP_ROUTES.RECIPE_EDIT,
        element: (
          <AuthPage>
            <AddRecipePage />
          </AuthPage>
        ),
        handle: routeHandle({ breadcrumb: { title: "Edit Recipe" } }),
      },
      {
        path: APP_ROUTES.USER,
        element: (
          <AuthPage>
            <UserPage />
          </AuthPage>
        ),
        handle: routeHandle({ breadcrumb: { title: "User" } }),
      },
      { path: APP_ROUTES.UI_KIT, element: <UiKitPage />, handle: routeHandle({ breadcrumb: { title: "UI Kit" } }) },
      { path: APP_ROUTES.SIGN_IN, element: <SignInPage />, handle: routeHandle({ breadcrumb: { title: "Sign In" } }) },
      {
        path: APP_ROUTES.NOT_FOUND,
        element: <NotFoundPage />,
        handle: routeHandle({ breadcrumb: { title: "Not Found" } }),
      },
      { path: "*", element: <Navigate to={APP_ROUTES.NOT_FOUND} replace /> },
    ],
  },
]);
