import { Link } from "react-router";

export const AnuncioPublicadoPage = () => {
  return (
    <div className="card">
      <h2>Anuncio publicado</h2>
      <p>Tu anuncio ya aparece en la lista de oportunidades.</p>

      <Link to="/dashboard">Volver al dashboard</Link>
    </div>
  );
};
