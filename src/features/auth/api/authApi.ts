import { apiRequest } from "@/shared/api";
import type { AuthDto } from "../model/dto/authDto";

export * as AuthApi from "./authApi";

const BASE_URL = "auth";

export const login = (data: AuthDto.LoginForm) =>
  apiRequest<AuthDto.LoginResult>(`${BASE_URL}/login`, { method: "post", json: data });

export const me = () => apiRequest<AuthDto.Me>(`${BASE_URL}/me`);

export const logout = () => apiRequest<void>(`${BASE_URL}/logout`, { method: "post" });
