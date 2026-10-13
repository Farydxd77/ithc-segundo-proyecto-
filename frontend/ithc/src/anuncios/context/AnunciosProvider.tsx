import { useCallback, useEffect, useState } from "react";
import { AnunciosContext } from "./AnunciosContext";
import { useAuth } from "../../auth/context/AuthContext";
import type { Anuncio, AnuncioDatos } from "../../domain/convocatoria";
import {
  cerrarConvocatoriaRequest,
  crearAnuncioRequest,
  editarAnuncioRequest,
  eliminarAnuncioRequest,
  inscribirseRequest,
  listarAnunciosRequest,
  reabrirConvocatoriaRequest,
} from "../../api/anunciosApi";
import { SIN_FILTROS, type Filtros } from "../../domain/filtros";

interface AnunciosProviderProps {
  children: React.ReactNode;
}

export const AnunciosProvider = ({ children }: AnunciosProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState<Filtros>(SIN_FILTROS);

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setAnuncios(await listarAnunciosRequest(filtros));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  // Los anuncios vienen de la base de datos: se cargan al iniciar sesión y cada vez que cambian los filtros.
  // La espera corta evita una petición por cada tecla mientras se escribe la búsqueda.
  useEffect(() => {
    if (!isAuthenticated) return;
    const espera = setTimeout(recargar, 300);
    return () => clearTimeout(espera);
  }, [isAuthenticated, recargar]);

  const cambiarFiltros = (cambios: Partial<Filtros>) => setFiltros((actual) => ({ ...actual, ...cambios }));

  const limpiarFiltros = () => setFiltros(SIN_FILTROS);

  // Reemplaza en la lista el anuncio que devolvió el backend
  const actualizar = (anuncio: Anuncio) => setAnuncios((lista) => lista.map((a) => ( (a.id === anuncio.id) ? anuncio : a)));

  const crear = async (datos: AnuncioDatos) => {
    const nuevo = await crearAnuncioRequest(datos);
    setAnuncios((lista) => [nuevo, ...lista]);
  };

  const editar = async (id: number, datos: AnuncioDatos) => actualizar(await editarAnuncioRequest(id, datos));

  const eliminar = async (id: number) => {
    await eliminarAnuncioRequest(id);
    setAnuncios((lista) => lista.filter((a) => a.id !== id));
  };

  const cerrar = async (id: number) => actualizar(await cerrarConvocatoriaRequest(id));

  const reabrir = async (id: number) => actualizar(await reabrirConvocatoriaRequest(id));

  const inscribirse = async (id: number) => actualizar(await inscribirseRequest(id));

  return (
    <AnunciosContext.Provider value={{ anuncios: isAuthenticated ? anuncios : [], cargando, error, filtros, cambiarFiltros, limpiarFiltros, recargar, crear, editar, eliminar, cerrar, reabrir, inscribirse }}>
      {children}
    </AnunciosContext.Provider>
  );
};
