import { useAnuncios } from "../context/AnunciosContext";
import { CAUSAS, MODALIDADES, type Causa, type Modalidad } from "../../domain/convocatoria";
import { filtrosActivos, type FiltroFecha } from "../../domain/filtros";

// Buscador y filtros de convocatorias; todos se pueden combinar
export const FiltrosConvocatorias = () => {
  const { filtros, cambiarFiltros, limpiarFiltros } = useAnuncios();
  const activos = filtrosActivos(filtros);

  return (
    <div className="filtros">
      <input
        type="search"
        placeholder="Buscar por título u organización"
        value={filtros.q}
        onChange={(e) => cambiarFiltros({ q: e.target.value })}
      />

      <div className="filtros-fila">
        <select aria-label="Filtrar por causa" value={filtros.causa}
          onChange={(e) => cambiarFiltros({ causa: e.target.value as Causa | "" })}>
          <option value="">Todas las causas</option>
          {Object.entries(CAUSAS).map(([valor, texto]) => (
            <option key={valor} value={valor}>{texto}</option>
          ))}
        </select>

        <select aria-label="Filtrar por modalidad" value={filtros.modalidad}
          onChange={(e) => cambiarFiltros({ modalidad: e.target.value as Modalidad | "" })}>
          <option value="">Toda modalidad</option>
          {Object.entries(MODALIDADES).map(([valor, texto]) => (
            <option key={valor} value={valor}>{texto}</option>
          ))}
        </select>

        <select aria-label="Filtrar por fecha" value={filtros.fecha}
          onChange={(e) => cambiarFiltros({ fecha: e.target.value as FiltroFecha, desde: "", hasta: "" })}>
          <option value="">Cualquier fecha</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Próximos 7 días</option>
          <option value="rango">Rango de fechas</option>
        </select>
      </div>

      {filtros.fecha === "rango" && (
        <div className="filtros-fila">
          <label>
            Desde <input type="date" value={filtros.desde} onChange={(e) => cambiarFiltros({ desde: e.target.value })} />
          </label>
          <label>
            Hasta <input type="date" value={filtros.hasta} onChange={(e) => cambiarFiltros({ hasta: e.target.value })} />
          </label>
        </div>
      )}

      <input
        placeholder="Ubicación o zona"
        value={filtros.lugar}
        onChange={(e) => cambiarFiltros({ lugar: e.target.value })}
      />

      <label className="check">
        <input
          type="checkbox"
          checked={filtros.disponibles}
          onChange={(e) => cambiarFiltros({ disponibles: e.target.checked })}
        />
        Solo abiertas y con cupos
      </label>
      <p className="ayuda">
        Muestra solo convocatorias abiertas, con fecha vigente y al menos un cupo libre: las únicas a las que puedes
        postularte.
      </p>

      {activos.length > 0 && (
        <div className="chips">
          {activos.map((f) => (
            <span key={f.texto} className="chip">
              {f.texto}
              <button type="button" aria-label={`Quitar ${f.texto}`} onClick={() => cambiarFiltros(f.quitar)}>
                ✕
              </button>
            </span>
          ))}
          <button type="button" className="secundario" onClick={limpiarFiltros}>
            Quitar todos
          </button>
        </div>
      )}
    </div>
  );
};
