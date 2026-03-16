export type UserSummary = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

export type UserProfile = UserSummary;

export type UserListResponse = {
  users: UserSummary[];
  total?: number;
  limit?: number;
  offset?: number;
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
  followingCount: number;
};
