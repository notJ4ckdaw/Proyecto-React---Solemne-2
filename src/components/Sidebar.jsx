import React from 'react';
import { Link } from 'react-router-dom';
import MenuNav from './MenuNav';

const Sidebar = () => {
  // Configuración de links para el MenuNav (RF-04)
  const links = [
    { label: 'Resumen', path: '/' },
    { label: 'Mapa de Calor / Zonas', path: '/materiales' },
    { label: 'Contacto de Soporte', path: '/contacto' }
  ];

  return (
    <aside className="app-sidebar">
      <div>
        {/* Nombre del Supermercado */}
        <div className="brand" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff' }}>
            🛒 VCM Supermarket
          </h2>
          <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Monitoreo de Flujo
          </span>
        </div>

        {/* Componente Obligatorio MenuNav (RF-04, 4.1) */}
        <MenuNav links={links} />

        {/* Selector de Piso (Adaptado del Wireframe) */}
        <div className="floor-selector">
          <div className="floor-title">Piso Seleccionado</div>
          <div className="floor-badge">Piso 1</div>
        </div>
      </div>

      {/* "¿Necesitas ayuda?" Widget linking to Contacto */}
      <div className="sidebar-help">
        <h4>¿Necesitas ayuda?</h4>
        <p>Contáctanos para incidencias en sensores o soporte de la app.</p>
        <Link to="/contacto" className="btn-help" style={{ textDecoration: 'none' }}>
          Contáctanos aquí
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
