import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export const RegisterPage = () => {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) return setError("Las contraseñas no coinciden");

    try {
      await register(name, email, password);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="card">
      <h2>Crear cuenta</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Confirmar contraseña"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>
      </form>

      <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
      <Link to="/">Volver al inicio</Link>
    </div>
  );
};
