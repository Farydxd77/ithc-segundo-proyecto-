import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "../../auth/context/AuthContext";
import { useAnuncios } from "../context/AnunciosContext";
import { AnuncioForm } from "../components/AnuncioForm";
import { esCreador, type AnuncioDatos } from "../../domain/convocatoria";

export const EditarAnuncioPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { anuncios, cargando, editar } = useAnuncios();

  const anuncio = anuncios.find((a) => a.id === Number(id));

  const guardar = async (datos: AnuncioDatos) => {
    await editar(Number(id), datos);
    navigate("/dashboard");
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="card">
      <h2>Editar anuncio</h2>

      {!anuncio && <p className="aviso">El anuncio no existe o fue eliminado.</p>}
      {anuncio && !esCreador(anuncio, user?.id) && <p className="aviso">Solo quien creó el anuncio puede editarlo.</p>}
      {anuncio && esCreador(anuncio, user?.id) && (
        <AnuncioForm inicial={anuncio} textoBoton="Guardar cambios" onGuardar={guardar} />
      )}

      <Link to="/dashboard">Volver al dashboard</Link>
    </div>
  );
};
