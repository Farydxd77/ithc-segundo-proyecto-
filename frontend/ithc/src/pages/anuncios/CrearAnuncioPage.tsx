import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { crearAnuncioRequest } from "../../api/anunciosApi";

export const CrearAnuncioPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: "", organizacion: "", descripcion: "", fecha: "", lugar: "", cupos: "",
  });
  const [error, setError] = useState("");

  const cambiar = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(form).some((v) => v.trim() === "")) return setError("Completa todos los campos");

    try {
      await crearAnuncioRequest({ ...form, cupos: Number(form.cupos) });
      navigate("/anuncio-publicado");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="card">
      <h2>Crear anuncio</h2>

      <form onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={cambiar} />
        <input name="organizacion" placeholder="Organización" value={form.organizacion} onChange={cambiar} />
        <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={cambiar} />
        <input name="fecha" type="date" value={form.fecha} onChange={cambiar} />
        <input name="lugar" placeholder="Lugar" value={form.lugar} onChange={cambiar} />
        <input name="cupos" type="number" min={1} placeholder="Cupos" value={form.cupos} onChange={cambiar} />

        {error && <p className="error">{error}</p>}
        <button type="submit">Publicar</button>
      </form>

      <Link to="/dashboard">Volver al dashboard</Link>
    </div>
  );
};