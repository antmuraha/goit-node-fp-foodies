import { apiClient } from "../client";
import { API_ROUTES } from "../../shared/constants/apiRoutes";
import type { UserProfile } from "../../entities/user";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
  user: UserProfile;
};

export const authApi = {
  client: apiClient,
  register: (payload: RegisterPayload): Promise<{ user: UserProfile }> =>
    apiClient.post<{ user: UserProfile }, RegisterPayload>(API_ROUTES.AUTH.REGISTER, { body: payload }),
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    apiClient.post<AuthResponse, LoginPayload>(API_ROUTES.AUTH.LOGIN, { body: payload }),
  logout: (token: string): Promise<void> =>
    apiClient.post<void>(API_ROUTES.AUTH.LOGOUT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getProfile: (token: string): Promise<UserProfile> =>
    apiClient.get<UserProfile>(API_ROUTES.AUTH.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};
