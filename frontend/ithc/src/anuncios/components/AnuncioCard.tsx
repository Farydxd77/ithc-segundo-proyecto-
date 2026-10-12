import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/context/AuthContext";
import { useAnuncios } from "../context/AnunciosContext";
import { esCreador, motivoBloqueoInscripcion, type Anuncio } from "../../domain/convocatoria";

interface AnuncioCardProps {
  anuncio: Anuncio;
}

export const AnuncioCard = ({ anuncio }: AnuncioCardProps) => {
  const { user } = useAuth();
  const { eliminar, cerrar, reabrir, inscribirse } = useAnuncios();
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState("");

  const esMio = esCreador(anuncio, user?.id);
  const bloqueo = motivoBloqueoInscripcion(anuncio, user?.id);

  const ejecutar = async (accion: () => Promise<void>) => {
    setError("");
    try {
      await accion();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="anuncio">
      <p>
        <strong>{anuncio.titulo}</strong> <span className={`estado ${anuncio.estado}`}>{anuncio.estado}</span>
      </p>
      <p>{anuncio.descripcion}</p>
      <p className="detalle">
        {anuncio.organizacion} · {anuncio.lugar} · {anuncio.fecha}
      </p>
      <p className="detalle">
        {anuncio.inscritos}/{anuncio.cupos} voluntarios inscritos · publicado por {anuncio.creadorNombre}
      </p>

      {/* Inscripción: si está bloqueada se explica el motivo */}
      {anuncio.inscrito ? (
        <p className="ok">✓ Estás inscrito</p>
      ) : (
        <>
          <button disabled={!!bloqueo} onClick={() => ejecutar(() => inscribirse(anuncio.id))}>
            Inscribirme
          </button>
          {bloqueo && <p className="aviso">{bloqueo}</p>}
        </>
      )}

      {/* El creador ve la lista de postulados */}
      {esMio && (
        <div className="postulados">
          <p className="detalle">Postulados:</p>
          {anuncio.postulados.length === 0 ? (
            <p className="detalle">Nadie se ha postulado todavía.</p>
          ) : (
            <ul>
              {anuncio.postulados.map((p) => (
                <li key={p.id}>{p.nombre}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Acciones del creador */}
      {esMio && !confirmando && (
        <div className="acciones">
          <Link to={`/editar-anuncio/${anuncio.id}`}>Editar</Link>
          {anuncio.estado === "abierta" ? (
            <button className="secundario" onClick={() => ejecutar(() => cerrar(anuncio.id))}>
              Cerrar convocatoria
            </button>
          ) : (
            <button className="secundario" onClick={() => ejecutar(() => reabrir(anuncio.id))}>
              Reabrir convocatoria
            </button>
          )}
          <button className="peligro" onClick={() => setConfirmando(true)}>
            Eliminar
          </button>
        </div>
      )}

      {confirmando && (
        <div className="confirmar">
          <p>¿Seguro que quieres eliminar "{anuncio.titulo}"? Esta acción no se puede deshacer.</p>
          <div className="acciones">
            <button className="peligro" onClick={() => ejecutar(() => eliminar(anuncio.id))}>
              Sí, eliminar
            </button>
            <button className="secundario" onClick={() => setConfirmando(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};
