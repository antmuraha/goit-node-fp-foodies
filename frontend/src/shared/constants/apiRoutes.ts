export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id: number | string): string => `/users/${id}`,
    FOLLOW: (id: number | string): string => `/users/${id}/follow`,
    FOLLOW_STATUS: (id: number | string): string => `/users/${id}/follow/status`,
    RECIPES: (id: number | string): string => `/users/${id}/recipes`,
    ME: "/users/me",
    ME_AVATAR: "/users/me/avatar",
    FOLLOWERS: (id: number | string): string => `/users/${id}/followers`,
    FOLLOWING: "/users/me/following",
  },
  RECIPES: {
    ROOT: "/recipes",
    BY_ID: (id: number | string): string => `/recipes/${id}`,
    POPULAR: "/recipes/popular",
    FAVORITES: "/recipes/favorites",
    FAVORITE_BY_ID: (id: number | string): string => `/recipes/${id}/favorite`,
    UPLOAD_IMAGE: "/recipes/upload/image",
  },
  CATEGORIES: {
    ROOT: "/categories",
  },
  AREAS: {
    ROOT: "/areas",
  },
  INGREDIENTS: {
    ROOT: "/ingredients",
  },
  TESTIMONIALS: {
    ROOT: "/testimonials",
  },
} as const;
