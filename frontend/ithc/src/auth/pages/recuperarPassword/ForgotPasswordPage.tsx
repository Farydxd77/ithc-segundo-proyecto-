import { useState } from "react";
import { Link } from "react-router";
import { forgotPasswordRequest } from "../../../api/authApi";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await forgotPasswordRequest(email);
      setResetToken(data.resetToken);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // No se envía un correo real: se muestra el enlace directamente
  if (resetToken) {
    return (
      <div className="card">
        <h2>Recuperar contraseña</h2>
        <p>Este es tu enlace para cambiar la contraseña:</p>
        <Link to={`/reset-password?token=${resetToken}`}>Cambiar mi contraseña</Link>
        <Link to="/login">Volver al login</Link>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Recuperar contraseña</h2>

      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Enviar enlace</button>
      </form>

      <Link to="/login">Volver</Link>
    </div>
  );
};
