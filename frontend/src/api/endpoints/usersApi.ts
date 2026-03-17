import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { PaginatedUserListResponse, UserListQuery, UserListResponse } from "../../entities/user";
import { getAuthHeaders } from "./helpers";
import { UserDetailsResponse } from "../../entities/user/model/types";

type UsersQuery = {
  limit?: number;
  offset?: number;
  search?: string;
};

type ProfileUsersApiResponse = {
  data: PaginatedUserListResponse["data"];
  total: number;
  page: number;
  limit: number;
};

type GetUsersConfig = {
  query?: UsersQuery;
  token?: string;
};

type FollowMutationResponse = {
  message: string;
};

type FollowStatusResponse = {
  userId: number;
  isFollowing: boolean;
};

const buildProfileUsersQuery = (query?: UserListQuery): { limit?: number; page?: number } | undefined => {
  if (!query) {
    return undefined;
  }

  const { limit, offset } = query;

  if (!limit) {
    return { limit };
  }

  const safeOffset = offset ?? 0;

  return {
    limit,
    page: Math.floor(safeOffset / limit) + 1,
  };
};

const normalizeProfileUsersResponse = (response: ProfileUsersApiResponse): PaginatedUserListResponse => ({
  data: response.data,
  total: response.total,
  limit: response.limit,
  offset: (response.page - 1) * response.limit,
});

export const usersApi = {
  client: apiClient,
  getUsers: ({ query, token }: GetUsersConfig = {}): Promise<UserListResponse> =>
    apiClient.get<UserListResponse>(API_ROUTES.USERS.ROOT, {
      query,
      headers: getAuthHeaders(token),
    }),
  getProfileFollowers: async (
    token: string,
    id: number | string,
    query?: UserListQuery,
  ): Promise<PaginatedUserListResponse> => {
    const response = await apiClient.get<ProfileUsersApiResponse>(API_ROUTES.USERS.FOLLOWERS(id), {
      query: buildProfileUsersQuery(query),
      headers: getAuthHeaders(token),
    });

    return normalizeProfileUsersResponse(response);
  },
  getProfileFollowing: async (token: string, query?: UserListQuery): Promise<PaginatedUserListResponse> => {
    const response = await apiClient.get<ProfileUsersApiResponse>(API_ROUTES.USERS.FOLLOWING, {
      query: buildProfileUsersQuery(query),
      headers: getAuthHeaders(token),
    });

    return normalizeProfileUsersResponse(response);
  },
  getUserById: (id: number, token?: string): Promise<UserDetailsResponse> =>
    apiClient.get<UserDetailsResponse>(API_ROUTES.USERS.BY_ID(id), {
      headers: getAuthHeaders(token),
    }),
  followUser: (token: string, id: number | string): Promise<FollowMutationResponse> =>
    apiClient.post<FollowMutationResponse>(API_ROUTES.USERS.FOLLOW(id), {
      headers: getAuthHeaders(token),
    }),
  unfollowUser: (token: string, id: number | string): Promise<FollowMutationResponse> =>
    apiClient.delete<FollowMutationResponse>(API_ROUTES.USERS.FOLLOW(id), {
      headers: getAuthHeaders(token),
    }),
  getFollowStatus: (token: string, id: number | string): Promise<FollowStatusResponse> =>
    apiClient.get<FollowStatusResponse>(API_ROUTES.USERS.FOLLOW_STATUS(id), {
      headers: getAuthHeaders(token),
    }),
};
