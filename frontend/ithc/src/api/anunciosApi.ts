// Sin backend: los anuncios se guardan en el navegador (localStorage)
export const crearAnuncioRequest = async (anuncio: object) => {
  const anuncios = JSON.parse(localStorage.getItem("anuncios") ?? "[]");
  const nuevo = { id: Date.now(), ...anuncio };
  localStorage.setItem("anuncios", JSON.stringify([...anuncios, nuevo]));
  return nuevo;
};
