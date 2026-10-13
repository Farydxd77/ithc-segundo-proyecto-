import { CAUSAS, MODALIDADES, fechaLocal, type Causa, type Modalidad } from "./convocatoria";

export type FiltroFecha = "" | "hoy" | "semana" | "rango";

export interface Filtros {
  q: string;
  causa: Causa | "";
  modalidad: Modalidad | "";
  lugar: string;
  fecha: FiltroFecha;
  desde: string;
  hasta: string;
  disponibles: boolean;
}

export const SIN_FILTROS: Filtros = {
  q: "",
  causa: "",
  modalidad: "",
  lugar: "",
  fecha: "",
  desde: "",
  hasta: "",
  disponibles: false,
};

// Convierte la opción de fecha en el rango desde/hasta que entiende el backend
export const rangoDeFechas = (filtros: Filtros, hoy = new Date()): { desde?: string; hasta?: string } => {
  if (filtros.fecha === "hoy") return { desde: fechaLocal(hoy), hasta: fechaLocal(hoy) };
  if (filtros.fecha === "semana") {
    const enUnaSemana = new Date(hoy);
    enUnaSemana.setDate(hoy.getDate() + 7);
    return { desde: fechaLocal(hoy), hasta: fechaLocal(enUnaSemana) };
  }
  if (filtros.fecha === "rango") return { desde: filtros.desde || undefined, hasta: filtros.hasta || undefined };
  return {};
};

// Query string con solo los filtros que tienen valor; los vacíos no se envían
export const aQueryString = (filtros: Filtros, hoy = new Date()) => {
  const params = new URLSearchParams();
  if (filtros.q.trim()) params.set("q", filtros.q.trim());
  if (filtros.causa) params.set("causa", filtros.causa);
  if (filtros.modalidad) params.set("modalidad", filtros.modalidad);
  if (filtros.lugar.trim()) params.set("lugar", filtros.lugar.trim());
  const { desde, hasta } = rangoDeFechas(filtros, hoy);
  if (desde) params.set("desde", desde);
  if (hasta) params.set("hasta", hasta);
  if (filtros.disponibles) params.set("disponibles", "true");
  const texto = params.toString();
  return texto ? `?${texto}` : "";
};

export interface FiltroActivo {
  texto: string;
  quitar: Partial<Filtros>;
}

// Lista de filtros activos para mostrarlos como etiquetas que se pueden quitar
export const filtrosActivos = (filtros: Filtros): FiltroActivo[] => {
  const activos: FiltroActivo[] = [];
  if (filtros.q.trim()) activos.push({ texto: `Búsqueda: "${filtros.q.trim()}"`, quitar: { q: "" } });
  if (filtros.causa) activos.push({ texto: `Causa: ${CAUSAS[filtros.causa]}`, quitar: { causa: "" } });
  if (filtros.modalidad) {
    activos.push({ texto: `Modalidad: ${MODALIDADES[filtros.modalidad]}`, quitar: { modalidad: "" } });
  }
  if (filtros.lugar.trim()) activos.push({ texto: `Ubicación: ${filtros.lugar.trim()}`, quitar: { lugar: "" } });
  const sinFecha = { fecha: "" as const, desde: "", hasta: "" };
  if (filtros.fecha === "hoy") activos.push({ texto: "Fecha: hoy", quitar: sinFecha });
  if (filtros.fecha === "semana") activos.push({ texto: "Fecha: próximos 7 días", quitar: sinFecha });
  if (filtros.fecha === "rango" && (filtros.desde || filtros.hasta)) {
    activos.push({ texto: `Fecha: ${filtros.desde || "…"} a ${filtros.hasta || "…"}`, quitar: sinFecha });
  }
  if (filtros.disponibles) activos.push({ texto: "Con cupos disponibles", quitar: { disponibles: false } });
  return activos;
};
