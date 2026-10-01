export interface User {
    id: number;
    name: string;
    email: string;
}

export type AuthStatus = "checking" | "authenticated" | "not-authenticated";

export interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
