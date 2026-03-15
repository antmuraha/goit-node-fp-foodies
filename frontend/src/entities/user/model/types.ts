export type UserSummary = {
  id: number;
  name: string;
  avatar?: string;
};

export type UserProfile = UserSummary;

export type UserListResponse = {
  users: UserSummary[];
  total?: number;
  limit?: number;
  offset?: number;
};
