import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { UserListResponse, UserSummary } from "../../entities/user";
import { getAuthHeaders } from "./helpers";

type UsersQuery = {
  limit?: number;
  offset?: number;
  search?: string;
};

type GetUsersConfig = {
  query?: UsersQuery;
  token?: string;
};

export const usersApi = {
  client: apiClient,
  getUsers: ({ query, token }: GetUsersConfig = {}): Promise<UserListResponse> =>
    apiClient.get<UserListResponse>(API_ROUTES.USERS.ROOT, {
      query,
      headers: getAuthHeaders(token),
    }),
  getUserById: (id: number, token?: string): Promise<UserSummary> =>
    apiClient.get<UserSummary>(API_ROUTES.USERS.BY_ID(id), {
      headers: getAuthHeaders(token),
    }),
};
