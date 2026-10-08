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
} from "../../api/anunciosApi";

interface AnunciosProviderProps {
  children: React.ReactNode;
}

export const AnunciosProvider = ({ children }: AnunciosProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setAnuncios(await listarAnunciosRequest());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  }, []);

  // Los anuncios vienen de la base de datos: se cargan al iniciar sesión
  useEffect(() => {
    if (isAuthenticated) recargar();
  }, [isAuthenticated, recargar]);

  // Reemplaza en la lista el anuncio que devolvió el backend
  const actualizar = (anuncio: Anuncio) => setAnuncios((lista) => lista.map((a) => (a.id === anuncio.id ? anuncio : a)));

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

  const inscribirse = async (id: number) => actualizar(await inscribirseRequest(id));

  return (
    <AnunciosContext.Provider value={{ anuncios: isAuthenticated ? anuncios : [], cargando, error, recargar, crear, editar, eliminar, cerrar, inscribirse }}>
      {children}
    </AnunciosContext.Provider>
  );
};
