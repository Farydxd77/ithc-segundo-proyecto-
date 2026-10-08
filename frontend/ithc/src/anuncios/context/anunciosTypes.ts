import type { Anuncio, AnuncioDatos } from "../../domain/convocatoria";

export interface AnunciosContextType {
  anuncios: Anuncio[];
  cargando: boolean;
  error: string;

  recargar: () => Promise<void>;
  crear: (datos: AnuncioDatos) => Promise<void>;
  editar: (id: number, datos: AnuncioDatos) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
  cerrar: (id: number) => Promise<void>;
  inscribirse: (id: number) => Promise<void>;
}
