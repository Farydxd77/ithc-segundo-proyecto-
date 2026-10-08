import { Link } from "react-router";
import { useAuth } from "../../auth/context/AuthContext";
import { useAnuncios } from "../../anuncios/context/AnunciosContext";
import { AnuncioCard } from "../../anuncios/components/AnuncioCard";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { anuncios, cargando, error } = useAnuncios();

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Bienvenido, {user?.name}</p>
      <p>{user?.email}</p>

      <Link to="/crear-anuncio">Crear anuncio</Link>

      <h3>Convocatorias</h3>
      {cargando && <p>Cargando...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && anuncios.length === 0 && <p>Todavía no hay anuncios.</p>}
      {anuncios.map((a) => (
        <AnuncioCard key={a.id} anuncio={a} />
      ))}

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};
