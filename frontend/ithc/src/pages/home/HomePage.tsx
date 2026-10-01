import { Link } from "react-router"
import { useAuth } from "../../auth/context/AuthContext"

export const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="card">
      <h1>Voluntariado Cerca</h1>
      <p>Página pública, se puede ver sin iniciar sesión.</p>

      {isAuthenticated ? (
        <Link to="/dashboard">Ir al dashboard</Link>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  )
}
