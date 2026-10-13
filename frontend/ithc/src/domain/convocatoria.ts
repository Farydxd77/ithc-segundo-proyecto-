export type Estado = "abierta" | "cerrada";
export type Causa = "medio_ambiente" | "educacion" | "salud" | "animales" | "comunidad";
export type Modalidad = "presencial" | "virtual";

export const CAUSAS: Record<Causa, string> = {
  medio_ambiente: "Medio ambiente",
  educacion: "Educación",
  salud: "Salud",
  animales: "Animales",
  comunidad: "Comunidad",
};

export const MODALIDADES: Record<Modalidad, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
};

export interface AnuncioDatos {
  titulo: string;
  organizacion: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  cupos: number;
  causa: Causa;
  modalidad: Modalidad;
}

// Los anuncios creados antes de agregar causa y modalidad las tienen en null
export interface Anuncio extends Omit<AnuncioDatos, "causa" | "modalidad"> {
  causa: Causa | null;
  modalidad: Modalidad | null;
  id: number;
  estado: Estado;
  creadorId: number;
  creadorNombre: string;
  inscritos: number;
  inscrito: boolean;
  postulados: Postulado[];
}

export interface Postulado {
  id: number;
  nombre: string;
}

export const esCreador = (anuncio: Anuncio, userId?: number) => anuncio.creadorId === userId;

// Fecha local en formato YYYY-MM-DD, el mismo que guarda el anuncio
export const fechaLocal = (fecha: Date) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

// Mismas reglas que el backend: devuelve el motivo por el que no se puede postular, o null si sí se puede.
export const motivoBloqueoInscripcion = (anuncio: Anuncio, userId?: number, hoy = new Date()): string | null => {
  if (esCreador(anuncio, userId)) return "No puedes postularte a tu propia convocatoria";
  if (anuncio.estado === "cerrada") return "La convocatoria está cerrada y ya no acepta inscripciones";
  if (anuncio.inscrito) return "Ya estás inscrito en esta convocatoria";
  if (anuncio.fecha < fechaLocal(hoy)) return "La fecha de la convocatoria ya pasó";
  if (anuncio.inscritos >= anuncio.cupos) return "No quedan cupos disponibles";
  return null;
};
