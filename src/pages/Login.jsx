import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(usuario, contrasena);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales inválidas. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page-container">
      <section className="login-card">
        <header className="login-header">
          <div className="login-logo-circle">
            <span role="img" aria-label="jumbo-logo">🔥</span>
          </div>
          <h1>JUMBO CENCOSUD</h1>
          <p>Control de Tránsito y Mapa de Calor</p>
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error-msg" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-input-group">
            <label htmlFor="login-username">Usuario</label>
            <input
              id="login-username"
              type="text"
              placeholder="ej. jefe.local"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="form-input-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar al Dashboard'}
          </button>
        </form>

        <footer className="login-card-footer">
          <p>Vinculación con el Medio (VCM)</p>
          <span>Solemne 3 · Cencosud S.A.</span>
        </footer>
      </section>
    </main>
  );
};

export default Login;
