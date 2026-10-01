import type { User } from "../auth/context/authTypes";

const API_URL = "http://localhost:8080/api/auth";

interface AuthResponse {
  token: string;
  user: User;
}

const request = async <T>(path: string, body?: unknown, token?: string): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_URL + path, {
    method: body === undefined ? "GET" : "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Error en el servidor");
  return data;
};

export const registerRequest = (name: string, email: string, password: string) =>
  request<AuthResponse>("/register", { name, email, password });

export const loginRequest = (email: string, password: string) =>
  request<AuthResponse>("/login", { email, password });

export const meRequest = (token: string) => request<User>("/me", undefined, token);

export const logoutRequest = (token: string) => request("/logout", {}, token);

export const forgotPasswordRequest = (email: string) =>
  request<{ resetToken: string }>("/forgot-password", { email });

export const resetPasswordRequest = (token: string, password: string) =>
  request("/reset-password", { token, password });
