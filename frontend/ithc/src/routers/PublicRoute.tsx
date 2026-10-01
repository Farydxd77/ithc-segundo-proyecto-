import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/context/AuthContext";

export const PublicRoute = () => {
  const { status } = useAuth();

  if (status === "checking") return <p>Cargando...</p>;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};