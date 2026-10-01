import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPasswordRequest } from "../../../api/authApi";

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="card">
        <p>Enlace inválido o expirado.</p>
        <Link to="/login">Volver al login</Link>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Las contraseñas no coinciden");

    try {
      await resetPasswordRequest(token, password);
      alert("Contraseña actualizada, ya puedes iniciar sesión");
      navigate("/login", { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="card">
      <h2>Nueva contraseña</h2>

      <form onSubmit={onSubmit}>
        <input type="password" placeholder="Nueva contraseña"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirmar contraseña"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Cambiar contraseña</button>
      </form>
    </div>
  );
};
