export type Estado = "abierta" | "cerrada";

export interface AnuncioDatos {
  titulo: string;
  organizacion: string;
  descripcion: string;
  fecha: string;
  lugar: string;
  cupos: number;
}

export interface Anuncio extends AnuncioDatos {
  id: number;
  estado: Estado;
  creadorId: number;
  creadorNombre: string;
  inscritos: number;
  inscrito: boolean;
}

// Restricción principal: una convocatoria cerrada no acepta inscripciones.
// Devuelve el motivo por el que no se puede inscribir, o null si sí se puede.
export const motivoBloqueoInscripcion = (anuncio: Anuncio): string | null => {
  if (anuncio.estado === "cerrada") return "La convocatoria está cerrada y ya no acepta inscripciones";
  if (anuncio.inscrito) return "Ya estás inscrito en esta convocatoria";
  if (anuncio.inscritos >= anuncio.cupos) return "No quedan cupos disponibles";
  return null;
};

export const esCreador = (anuncio: Anuncio, userId?: number) => anuncio.creadorId === userId;
