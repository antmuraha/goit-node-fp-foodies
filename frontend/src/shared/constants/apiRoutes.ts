export const API_ROUTES = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    ROOT: "/users",
    BY_ID: (id: number | string): string => `/users/${id}`,
    ME: "/users/me",
  },
  RECIPES: {
    ROOT: "/recipes",
    BY_ID: (id: number | string): string => `/recipes/${id}`,
    POPULAR: "/recipes/popular",
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
