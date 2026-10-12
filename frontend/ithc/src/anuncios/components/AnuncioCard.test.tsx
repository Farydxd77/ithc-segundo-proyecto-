import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AnuncioCard } from "./AnuncioCard";
import type { Anuncio } from "../../domain/convocatoria";

const cerrar = vi.fn();
const reabrir = vi.fn();

// El usuario con sesión iniciada es el creador del anuncio (id 7)
vi.mock("../../auth/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 7 } }),
}));

vi.mock("../context/AnunciosContext", () => ({
  useAnuncios: () => ({ eliminar: vi.fn(), cerrar, reabrir, inscribirse: vi.fn() }),
}));

afterEach(cleanup);
beforeEach(() => {
  cerrar.mockReset();
  reabrir.mockReset();
});

const anuncio: Anuncio = {
  id: 1,
  titulo: "Limpieza del parque",
  organizacion: "Voluntariado Cerca",
  descripcion: "Recoger basura en el parque",
  fecha: "2099-01-01",
  lugar: "Parque central",
  cupos: 20,
  estado: "abierta",
  creadorId: 7,
  creadorNombre: "Ana",
  inscritos: 0,
  inscrito: false,
  postulados: [],
};

const mostrar = (a: Anuncio) =>
  render(
    <MemoryRouter>
      <AnuncioCard anuncio={a} />
    </MemoryRouter>,
  );

describe("Reabrir convocatoria", () => {
  it("una convocatoria abierta muestra Cerrar y no Reabrir", () => {
    mostrar(anuncio);

    expect(screen.getByText("Cerrar convocatoria")).toBeTruthy();
    expect(screen.queryByText("Reabrir convocatoria")).toBeNull();
  });

  it("una convocatoria cerrada muestra el botón Reabrir al creador", () => {
    mostrar({ ...anuncio, estado: "cerrada" });

    expect(screen.getByText("Reabrir convocatoria")).toBeTruthy();
    expect(screen.queryByText("Cerrar convocatoria")).toBeNull();
  });

  it("al pulsar Reabrir se reabre la convocatoria", async () => {
    reabrir.mockResolvedValue(undefined);
    mostrar({ ...anuncio, estado: "cerrada" });

    fireEvent.click(screen.getByText("Reabrir convocatoria"));

    await waitFor(() => expect(reabrir).toHaveBeenCalledWith(1));
  });

  it("muestra el error que devuelve el backend al reabrir", async () => {
    reabrir.mockRejectedValue(new Error("La convocatoria ya está abierta"));
    mostrar({ ...anuncio, estado: "cerrada" });

    fireEvent.click(screen.getByText("Reabrir convocatoria"));

    expect(await screen.findByText("La convocatoria ya está abierta")).toBeTruthy();
  });

  it("quien no es el creador no ve el botón Reabrir", () => {
    mostrar({ ...anuncio, estado: "cerrada", creadorId: 8 });

    expect(screen.queryByText("Reabrir convocatoria")).toBeNull();
  });
});

describe("Postulación", () => {
  it("al creador se le bloquea la postulación y se le explica el motivo", () => {
    mostrar(anuncio);

    expect((screen.getByText("Inscribirme") as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText("No puedes postularte a tu propia convocatoria")).toBeTruthy();
  });

  it("el creador ve la lista de postulados", () => {
    mostrar({ ...anuncio, inscritos: 1, postulados: [{ id: 9, nombre: "Luis" }] });

    expect(screen.getByText("Luis")).toBeTruthy();
  });

  it("quien no es el creador puede postularse y no ve la lista", () => {
    mostrar({ ...anuncio, creadorId: 8 });

    expect((screen.getByText("Inscribirme") as HTMLButtonElement).disabled).toBe(false);
    expect(screen.queryByText("Postulados:")).toBeNull();
  });
});
