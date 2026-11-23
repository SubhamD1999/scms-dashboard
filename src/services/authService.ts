import { api, tokenStorage } from "./genericService";

export const AUTH_ENDPOINTS = {
  login: "/login",
};

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  [key: string]: unknown;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await api.post<LoginResponse, LoginPayload>(
    AUTH_ENDPOINTS.login,
    payload,
    { auth: false } 
  );

  if (data?.token) tokenStorage.set(data.token);

  return data;
}