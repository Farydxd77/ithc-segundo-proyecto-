import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AnuncioForm } from "./AnuncioForm";

afterEach(cleanup);

const llenar = (placeholder: string, valor: string) =>
  fireEvent.change(screen.getByPlaceholderText(placeholder), { target: { value: valor } });

describe("AnuncioForm", () => {
  it("muestra un error si se envía con campos vacíos", () => {
    const onGuardar = vi.fn();
    render(<AnuncioForm textoBoton="Publicar" onGuardar={onGuardar} />);

    fireEvent.click(screen.getByText("Publicar"));

    expect(screen.getByText("Completa todos los campos")).toBeTruthy();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("envía los datos con cupos como número", async () => {
    const onGuardar = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<AnuncioForm textoBoton="Publicar" onGuardar={onGuardar} />);

    llenar("Título", "Limpieza del parque");
    llenar("Organización", "Voluntariado Cerca");
    llenar("Descripción", "Recoger basura");
    llenar("Lugar", "Parque central");
    llenar("Cupos", "20");
    fireEvent.change(container.querySelector('input[name="fecha"]')!, { target: { value: "2026-10-10" } });
    fireEvent.change(screen.getByLabelText("Causa"), { target: { value: "medio_ambiente" } });
    fireEvent.change(screen.getByLabelText("Modalidad"), { target: { value: "presencial" } });

    fireEvent.click(screen.getByText("Publicar"));

    await waitFor(() =>
      expect(onGuardar).toHaveBeenCalledWith({
        titulo: "Limpieza del parque",
        organizacion: "Voluntariado Cerca",
        descripcion: "Recoger basura",
        fecha: "2026-10-10",
        lugar: "Parque central",
        cupos: 20,
        causa: "medio_ambiente",
        modalidad: "presencial",
      }),
    );
  });

  it("muestra el error que devuelve el backend", async () => {
    const onGuardar = vi.fn().mockRejectedValue(new Error("No autorizado"));
    const inicial = {
      titulo: "A", organizacion: "B", descripcion: "C", fecha: "2026-10-10", lugar: "D", cupos: 5, causa: "salud" as const, modalidad: "virtual" as const,
    };
    render(<AnuncioForm inicial={inicial} textoBoton="Guardar cambios" onGuardar={onGuardar} />);

    fireEvent.click(screen.getByText("Guardar cambios"));

    expect(await screen.findByText("No autorizado")).toBeTruthy();
  });
});
