import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/context/AuthContext";

export const PrivateRoute = () => {
  const { status } = useAuth();

  if (status === "checking") return <p>Cargando...</p>;
  if (status === "not-authenticated") return <Navigate to="/login" replace />;

  return <Outlet />;
};