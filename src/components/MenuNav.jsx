import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuNav = ({ links }) => {
  return (
    <nav className="menu-nav" aria-label="Menú principal de navegación">
      <ul className="nav-list">
        {links && links.map((link, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              {link.label === 'Resumen' && '📊 '}
              {link.label === 'Mapa de calor' && '🔥 '}
              {link.label === 'Tráfico por piso' && '👣 '}
              {link.label === 'Zonas' && '📍 '}
              {link.label === 'Reportes' && '📄 '}
              {link.label === 'Alertas' && '🔔 '}
              {link.label === 'Comparaciones' && '📈 '}
              {link.label === 'Configuración' && '⚙️ '}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuNav;
