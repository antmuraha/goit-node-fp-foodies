export type UserSummary = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

export type UserListQuery = {
  limit?: number;
  offset?: number;
};

export type UserProfile = UserSummary;

export type UserListResponse = {
  users: UserSummary[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedUserListResponse = {
  data: UserSummary[];
  total: number;
  limit: number;
  offset: number;
};

export type UserDetailsResponse = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  recipesCreated: number;
  followersCount: number;
};

export type MeProfile = UserDetailsResponse & {
  favoritesCount: number;
  favoriteRecipeIds: number[];
  followingCount: number;
};
