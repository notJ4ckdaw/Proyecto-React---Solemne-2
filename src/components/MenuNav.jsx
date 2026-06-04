import React from 'react';
import { NavLink } from 'react-router-dom';

const MenuNav = ({ links }) => {
  return (
    <nav className="menu-nav" aria-label="Menú principal de navegación">
      <div className="nav-title">Navegación</div>
      <ul className="nav-list">
        {links && links.map((link, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={link.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              {link.label.includes('Resumen') && '📊 '}
              {link.label.includes('Mapa') && '🔥 '}
              {link.label.includes('Contacto') && '✉️ '}
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuNav;
