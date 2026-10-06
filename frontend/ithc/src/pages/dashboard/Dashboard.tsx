import { Link } from "react-router";
import { useAuth } from "../../auth/context/AuthContext";

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Bienvenido, {user?.name}</p>
      <p>{user?.email}</p>

      <Link to="/crear-anuncio">Crear anuncio</Link>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};
