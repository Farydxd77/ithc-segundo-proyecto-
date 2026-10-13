import { describe, expect, it } from "vitest";
import { esCreador, motivoBloqueoInscripcion, type Anuncio } from "./convocatoria";

const anuncio: Anuncio = {
  id: 1,
  titulo: "Limpieza del parque",
  organizacion: "Voluntariado Cerca",
  descripcion: "Recoger basura en el parque",
  fecha: "2099-01-01",
  lugar: "Parque central",
  cupos: 20,
  causa: "medio_ambiente",
  modalidad: "presencial",
  estado: "abierta",
  creadorId: 7,
  creadorNombre: "Ana",
  inscritos: 0,
  inscrito: false,
  postulados: [],
};

describe("Inscripción a una convocatoria", () => {
  it("una convocatoria abierta con cupos acepta inscripciones", () => {
    expect(motivoBloqueoInscripcion(anuncio)).toBeNull();
  });

  it("una convocatoria cerrada no acepta inscripciones y explica el motivo", () => {
    const cerrada: Anuncio = { ...anuncio, estado: "cerrada" };
    expect(motivoBloqueoInscripcion(cerrada)).toBe("La convocatoria está cerrada y ya no acepta inscripciones");
  });

  it("una convocatoria reabierta vuelve a aceptar inscripciones", () => {
    const cerrada: Anuncio = { ...anuncio, estado: "cerrada" };
    const reabierta: Anuncio = { ...cerrada, estado: "abierta" };
    expect(motivoBloqueoInscripcion(reabierta)).toBeNull();
  });

  it("no se puede inscribir dos veces", () => {
    expect(motivoBloqueoInscripcion({ ...anuncio, inscrito: true })).toBe("Ya estás inscrito en esta convocatoria");
  });

  it("no se puede inscribir si no quedan cupos", () => {
    expect(motivoBloqueoInscripcion({ ...anuncio, inscritos: 20 })).toBe("No quedan cupos disponibles");
  });

  it("no se puede inscribir si la fecha ya pasó", () => {
    const hoy = new Date(2026, 9, 10);
    expect(motivoBloqueoInscripcion({ ...anuncio, fecha: "2026-10-09" }, 8, hoy)).toBe(
      "La fecha de la convocatoria ya pasó",
    );
    expect(motivoBloqueoInscripcion({ ...anuncio, fecha: "2026-10-10" }, 8, hoy)).toBeNull();
  });

  it("el creador no puede postularse a su propia convocatoria", () => {
    expect(motivoBloqueoInscripcion(anuncio, 7)).toBe("No puedes postularte a tu propia convocatoria");
  });
});

describe("Creador del anuncio", () => {
  it("solo el creador puede gestionar el anuncio", () => {
    expect(esCreador(anuncio, 7)).toBe(true);
    expect(esCreador(anuncio, 8)).toBe(false);
  });
});
