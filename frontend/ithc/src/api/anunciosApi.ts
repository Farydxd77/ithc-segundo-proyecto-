import type { Anuncio, AnuncioDatos } from "../domain/convocatoria";
import { aQueryString, SIN_FILTROS, type Filtros } from "../domain/filtros";
import { request } from "./http";

export const listarAnunciosRequest = (filtros: Filtros = SIN_FILTROS) =>
  request<Anuncio[]>("GET", `/anuncios${aQueryString(filtros)}`);

export const crearAnuncioRequest = (datos: AnuncioDatos) => request<Anuncio>("POST", "/anuncios", datos);

export const editarAnuncioRequest = (id: number, datos: AnuncioDatos) =>
  request<Anuncio>("PUT", `/anuncios/${id}`, datos);

export const eliminarAnuncioRequest = (id: number) => request("DELETE", `/anuncios/${id}`);

export const cerrarConvocatoriaRequest = (id: number) => request<Anuncio>("POST", `/anuncios/${id}/cerrar`);

export const reabrirConvocatoriaRequest = (id: number) => request<Anuncio>("POST", `/anuncios/${id}/reabrir`);

export const inscribirseRequest = (id: number) => request<Anuncio>("POST", `/anuncios/${id}/inscribirse`);
