import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FiltrosConvocatorias } from "./FiltrosConvocatorias";
import { SIN_FILTROS } from "../../domain/filtros";

vi.mock("../context/AnunciosContext", () => ({
  useAnuncios: () => ({ filtros: SIN_FILTROS, cambiarFiltros: vi.fn(), limpiarFiltros: vi.fn() }),
}));

describe("Ayuda de los filtros", () => {
  it("explica qué significa el filtro de disponibilidad junto a la casilla", () => {
    render(<FiltrosConvocatorias />);

    expect(screen.getByText("Solo abiertas y con cupos")).toBeTruthy();
    expect(screen.getByText(/las únicas a las que puedes postularte/)).toBeTruthy();
  });
});
