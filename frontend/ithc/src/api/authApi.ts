import type { User } from "../auth/context/authTypes";
import { request } from "./http";

interface AuthResponse {
  token: string;
  user: User;
}

export const registerRequest = (name: string, email: string, password: string) =>
  request<AuthResponse>("POST", "/auth/register", { name, email, password });

export const loginRequest = (email: string, password: string) =>
  request<AuthResponse>("POST", "/auth/login", { email, password });

export const meRequest = () => request<User>("GET", "/auth/me");

export const logoutRequest = () => request("POST", "/auth/logout", {});

export const forgotPasswordRequest = (email: string) =>
  request<{ resetToken: string }>("POST", "/auth/forgot-password", { email });

export const resetPasswordRequest = (token: string, password: string) =>
  request("POST", "/auth/reset-password", { token, password });
