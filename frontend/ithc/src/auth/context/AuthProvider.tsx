import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthStatus, User } from "./authTypes";
import { loginRequest, logoutRequest, meRequest, registerRequest } from "../../api/authApi";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");

  // Al cargar la app: revisar si ya había sesión guardada y validarla con el backend
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setStatus("not-authenticated");
        return;
      }

      try {
        const userLogged = await meRequest();
        setUser(userLogged);
        setStatus("authenticated");
      } catch {
        localStorage.removeItem("token");
        setStatus("not-authenticated");
      }
    };

    checkAuth();
  }, []);

  const saveSession = (token: string, userLogged: User) => {
    localStorage.setItem("token", token);
    setUser(userLogged);
    setStatus("authenticated");
  };

  const login = async (email: string, password: string) => {
    const { token, user } = await loginRequest(email, password);
    saveSession(token, user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user } = await registerRequest(name, email, password);
    saveSession(token, user);
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) await logoutRequest().catch(() => {});

    localStorage.removeItem("token");
    setUser(null);
    setStatus("not-authenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isAuthenticated: status === "authenticated",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
