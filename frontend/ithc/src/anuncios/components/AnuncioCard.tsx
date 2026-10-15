import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/context/AuthContext";
import { useAnuncios } from "../context/AnunciosContext";
import {
  CAUSAS,
  ESTADOS,
  MODALIDADES,
  esCreador,
  fechaLegible,
  estadoVisible,
  motivoBloqueoInscripcion,
  type Anuncio,
} from "../../domain/convocatoria";

interface AnuncioCardProps {
  anuncio: Anuncio;
}

export const AnuncioCard = ({ anuncio }: AnuncioCardProps) => {
  const { user } = useAuth();
  const { eliminar, cerrar, reabrir, inscribirse, cancelarPostulacion } = useAnuncios();
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const esMio = esCreador(anuncio, user?.id);
  const bloqueo = motivoBloqueoInscripcion(anuncio, user?.id);
  const estado = estadoVisible(anuncio);

  // Si la acción sale bien se muestra el resultado junto al botón
  const ejecutar = async (accion: () => Promise<void>, exito = "") => {
    setError("");
    setMensaje("");
    try {
      await accion();
      setMensaje(exito);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="anuncio">
      <p>
        <strong>{anuncio.titulo}</strong> <span className={`estado ${estado}`}>{ESTADOS[estado]}</span>
      </p>
      <p>{anuncio.descripcion}</p>
      <p className="detalle">
        {anuncio.organizacion} · {anuncio.lugar} · {fechaLegible(anuncio.fecha)}
      </p>
      {(anuncio.causa || anuncio.modalidad) && (
        <p className="detalle">
          {[anuncio.causa && CAUSAS[anuncio.causa], anuncio.modalidad && MODALIDADES[anuncio.modalidad]]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}
      <p className="detalle">
        {anuncio.inscritos}/{anuncio.cupos} voluntarios inscritos · publicado por {anuncio.creadorNombre}
      </p>

      {/* Inscripción: si está bloqueada se explica el motivo */}
      {anuncio.inscrito ? (
        <div className="acciones">
          <p className="ok">✓ Estás inscrito</p>
          <button
            className="secundario"
            onClick={() =>
              ejecutar(() => cancelarPostulacion(anuncio.id), "Cancelaste tu postulación. El cupo quedó libre.")
            }
          >
            Cancelar postulación
          </button>
        </div>
      ) : (
        <>
          <button
            disabled={!!bloqueo}
            onClick={() =>
              ejecutar(() => inscribirse(anuncio.id), "Postulación enviada. Ya apareces entre los postulados.")
            }
          >
            Inscribirme
          </button>
          {bloqueo && <p className="aviso">{bloqueo}</p>}
        </>
      )}
      {mensaje && (
        <p className="confirmacion" role="status">
          {mensaje}
        </p>
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
