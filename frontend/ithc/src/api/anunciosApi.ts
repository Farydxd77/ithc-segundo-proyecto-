import type { Anuncio, AnuncioDatos } from "../domain/convocatoria";
import { request } from "./http";

export const listarAnunciosRequest = () => request<Anuncio[]>("GET", "/anuncios");

export const crearAnuncioRequest = (datos: AnuncioDatos) => request<Anuncio>("POST", "/anuncios", datos);

export const editarAnuncioRequest = (id: number, datos: AnuncioDatos) =>
  request<Anuncio>("PUT", `/anuncios/${id}`, datos);

export const eliminarAnuncioRequest = (id: number) => request("DELETE", `/anuncios/${id}`);

export const cerrarConvocatoriaRequest = (id: number) => request<Anuncio>("POST", `/anuncios/${id}/cerrar`);

export const inscribirseRequest = (id: number) => request<Anuncio>("POST", `/anuncios/${id}/inscribirse`);
