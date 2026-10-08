import { createContext, useContext } from "react";
import type { AnunciosContextType } from "./anunciosTypes";

export const AnunciosContext = createContext<AnunciosContextType | undefined>(undefined);

export const useAnuncios = (): AnunciosContextType => {
  const context = useContext(AnunciosContext);

  if (!context) {
    throw new Error("useAnuncios debe utilizarse dentro de un AnunciosProvider");
  }

  return context;
};
