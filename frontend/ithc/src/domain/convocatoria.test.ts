import { describe, expect, it } from "vitest";
import { esCreador, motivoBloqueoInscripcion, type Anuncio } from "./convocatoria";

const anuncio: Anuncio = {
  id: 1,
  titulo: "Limpieza del parque",
  organizacion: "Voluntariado Cerca",
  descripcion: "Recoger basura en el parque",
  fecha: "2026-10-10",
  lugar: "Parque central",
  cupos: 20,
  estado: "abierta",
  creadorId: 7,
  creadorNombre: "Ana",
  inscritos: 0,
  inscrito: false,
};

describe("Inscripción a una convocatoria", () => {
  it("una convocatoria abierta con cupos acepta inscripciones", () => {
    expect(motivoBloqueoInscripcion(anuncio)).toBeNull();
  });

  it("una convocatoria cerrada no acepta inscripciones y explica el motivo", () => {
    const cerrada: Anuncio = { ...anuncio, estado: "cerrada" };
    expect(motivoBloqueoInscripcion(cerrada)).toBe("La convocatoria está cerrada y ya no acepta inscripciones");
  });

  it("no se puede inscribir dos veces", () => {
    expect(motivoBloqueoInscripcion({ ...anuncio, inscrito: true })).toBe("Ya estás inscrito en esta convocatoria");
  });

  it("no se puede inscribir si no quedan cupos", () => {
    expect(motivoBloqueoInscripcion({ ...anuncio, inscritos: 20 })).toBe("No quedan cupos disponibles");
  });
});

describe("Creador del anuncio", () => {
  it("solo el creador puede gestionar el anuncio", () => {
    expect(esCreador(anuncio, 7)).toBe(true);
    expect(esCreador(anuncio, 8)).toBe(false);
  });
});
