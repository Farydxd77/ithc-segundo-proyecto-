import { useAuth } from "../../auth/context/AuthContext";

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Bienvenido, {user?.name}</p>
      <p>{user?.email}</p>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};
