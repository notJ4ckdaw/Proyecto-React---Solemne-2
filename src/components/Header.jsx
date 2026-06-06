import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const topLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Mapa de Calor', path: '/materiales' },
    { label: 'Contacto', path: '/contacto' }
  ];

  return (
    <header className="app-header">
      <div className="header-info">
        <h1 className="sr-only">Jumbo Cencosud - Panel de Monitoreo</h1>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1.2rem', color: '#0f172a' }}>
          Mapa de Calor
        </p>
        <span style={{ fontSize: '0.85rem', color: '#475569' }}>
          Visualiza el mapa en base a la concentración de clientes y el flujo en Jumbo Cencosud
        </span>
      </div>

      {/* Menú de navegación horizontal de cabecera (Cumple Flexbox 3.2 y RNF-03) */}
      <nav className="header-nav" aria-label="Navegación horizontal de cabecera">
        <ul className="header-nav-list">
          {topLinks.map((link, idx) => (
            <li key={idx}>
              <NavLink 
                to={link.path}
                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          backgroundColor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          padding: '0.4rem 0.8rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#0f172a'
        }}>
          📅 08 Mayo - 28 Mayo / 2026
        </div>
        <button style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '0.4rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onClick={() => alert("Función de filtros estáticos (Solemne 2 - Datos locales)")}
        title="Filtrar datos del mapa"
        type="button">
          Filtros
        </button>
      </div>
    </header>
  );
};

export default Header;
