import { describe, expect, it } from "vitest";
import { aQueryString, filtrosActivos, rangoDeFechas, SIN_FILTROS } from "./filtros";

const hoy = new Date(2026, 9, 12); // 12 de octubre de 2026

describe("Filtros de convocatorias", () => {
  it("sin filtros no envía parámetros y no muestra filtros activos", () => {
    expect(aQueryString(SIN_FILTROS, hoy)).toBe("");
    expect(filtrosActivos(SIN_FILTROS)).toEqual([]);
  });

  it("combina búsqueda, causa, modalidad y disponibilidad en un solo pedido", () => {
    const filtros = { ...SIN_FILTROS, q: " lectura ", causa: "educacion" as const, modalidad: "virtual" as const, disponibles: true };

    expect(aQueryString(filtros, hoy)).toBe("?q=lectura&causa=educacion&modalidad=virtual&disponibles=true");
    expect(filtrosActivos(filtros).map((f) => f.texto)).toEqual([
      'Búsqueda: "lectura"',
      "Causa: Educación",
      "Modalidad: Virtual",
      "Con cupos disponibles",
    ]);
  });

  it("convierte hoy y próximos 7 días en un rango de fechas", () => {
    expect(rangoDeFechas({ ...SIN_FILTROS, fecha: "hoy" }, hoy)).toEqual({ desde: "2026-10-12", hasta: "2026-10-12" });
    expect(rangoDeFechas({ ...SIN_FILTROS, fecha: "semana" }, hoy)).toEqual({ desde: "2026-10-12", hasta: "2026-10-19" });
    expect(aQueryString({ ...SIN_FILTROS, fecha: "rango", desde: "2026-11-01", hasta: "" }, hoy)).toBe("?desde=2026-11-01");
  });

  it("quitar un filtro activo lo deja vacío sin tocar los demás", () => {
    const filtros = { ...SIN_FILTROS, causa: "salud" as const, fecha: "semana" as const };
    const [causa, fecha] = filtrosActivos(filtros);

    expect({ ...filtros, ...causa.quitar }).toEqual({ ...SIN_FILTROS, fecha: "semana" });
    expect({ ...filtros, ...fecha.quitar }).toEqual({ ...SIN_FILTROS, causa: "salud" });
  });
});
