import { useState } from "react";
import type { AnuncioDatos } from "../../domain/convocatoria";

interface AnuncioFormProps {
  inicial?: AnuncioDatos;
  textoBoton: string;
  onGuardar: (datos: AnuncioDatos) => Promise<void>;
}

const vacio = { titulo: "", organizacion: "", descripcion: "", fecha: "", lugar: "", cupos: "" };

// Formulario compartido entre crear y editar anuncio
export const AnuncioForm = ({ inicial, textoBoton, onGuardar }: AnuncioFormProps) => {
  const [form, setForm] = useState(
    inicial
      ? {
          titulo: inicial.titulo,
          organizacion: inicial.organizacion,
          descripcion: inicial.descripcion,
          fecha: inicial.fecha,
          lugar: inicial.lugar,
          cupos: String(inicial.cupos),
        }
      : vacio,
  );
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => v.trim() === "")) return setError("Completa todos los campos");

    setGuardando(true);
    try {
      await onGuardar({ ...form, cupos: Number(form.cupos) });
    } catch (err) {
      setError((err as Error).message);
      setGuardando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="titulo" placeholder="Título" value={form.titulo} onChange={cambiar} />
      <input name="organizacion" placeholder="Organización" value={form.organizacion} onChange={cambiar} />
      <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar} />
      <input name="fecha" type="date" value={form.fecha} onChange={cambiar} />
      <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={cambiar} />
      <input name="cupos" type="number" min={1} placeholder="Cupos" value={form.cupos} onChange={cambiar} />

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={guardando}>{guardando ? "Guardando..." : textoBoton}</button>
    </form>
  );
};
