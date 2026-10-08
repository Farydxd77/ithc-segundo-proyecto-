const API_URL = "http://localhost:8080/api";

type Method = "GET" | "POST" | "PUT" | "DELETE";

// Petición genérica al backend: agrega el token si hay sesión y lanza el mensaje de error del servidor
export const request = async <T>(method: Method, path: string, body?: unknown): Promise<T> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API_URL + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Error en el servidor");
  return data;
};
