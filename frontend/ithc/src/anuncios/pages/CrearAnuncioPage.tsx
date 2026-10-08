import { Link, useNavigate } from "react-router";
import { useAnuncios } from "../context/AnunciosContext";
import { AnuncioForm } from "../components/AnuncioForm";
import type { AnuncioDatos } from "../../domain/convocatoria";

export const CrearAnuncioPage = () => {
  const navigate = useNavigate();
  const { crear } = useAnuncios();

  const guardar = async (datos: AnuncioDatos) => {
    await crear(datos);
    navigate("/anuncio-publicado");
  };

  return (
    <div className="card">
      <h2>Crear anuncio</h2>
      <AnuncioForm textoBoton="Publicar" onGuardar={guardar} />
      <Link to="/dashboard">Volver al dashboard</Link>
    </div>
  );
};
