import React from 'react';
import { Link } from 'react-router-dom';
import MenuNav from './MenuNav';

const Sidebar = () => {
  // Configuración de links para el MenuNav exactos al Mockup (RF-04)
  const links = [
    { label: 'Resumen', path: '/' },
    { label: 'Mapa de calor', path: '/materiales' },
    { label: 'Tráfico por piso', path: '/trafico' },
    { label: 'Zonas', path: '/zonas' },
    { label: 'Reportes', path: '/reportes' },
    { label: 'Alertas', path: '/alertas' },
    { label: 'Comparaciones', path: '/comparaciones' },
    { label: 'Configuración', path: '/configuracion' }
  ];

  return (
    <aside className="app-sidebar">
      <div>
        {/* Nombre del Supermercado (Jumbo Inteligencia de Espacios) */}
        <div className="brand" style={{ marginBottom: '2.5rem', textAlign: 'left', paddingLeft: '1rem' }}>
          <h2 style={{ 
            fontSize: '1.7rem', 
            fontWeight: 900, 
            letterSpacing: '-0.03em', 
            color: '#ffffff',
            margin: 0,
            lineHeight: 1.1
          }}>
            JUMBO
          </h2>
          <span style={{ 
            fontSize: '0.65rem', 
            opacity: 0.8, 
            textTransform: 'none', 
            letterSpacing: '0.02em',
            fontWeight: 500,
            color: '#ffffff'
          }}>
            Inteligencia de Espacios
          </span>
        </div>

        {/* Componente Obligatorio MenuNav (RF-04, 4.1) */}
        <MenuNav links={links} />

        {/* Selector de Piso (Adaptado del Mockup: Botón Dropdown verde oscuro) */}
        <div className="floor-selector" style={{ marginTop: '2.5rem' }}>
          <div className="floor-title" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Piso Seleccionado
          </div>
          <button style={{
            width: '100%',
            backgroundColor: '#007345',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onClick={() => alert("Piso 1 Seleccionado (Versión de datos estáticos Solemne 2)")}
          type="button">
            <span>🟢 Piso 1</span>
            <span style={{ fontSize: '0.7rem' }}>▼</span>
          </button>
        </div>
      </div>

      {/* "¿Necesitas ayuda? Consulta nuestra guía" Widget */}
      <div className="sidebar-help">
        <h4 style={{ 
          fontSize: '0.85rem', 
          fontWeight: 700, 
          color: '#ffffff', 
          marginBottom: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          justifyContent: 'center' 
        }}>
          <span style={{ fontSize: '1rem' }}>❔</span> ¿Necesitas ayuda?
        </h4>
        <p style={{ display: 'none' }}></p>
        <Link to="/contacto" className="btn-help" style={{ 
          textDecoration: 'none', 
          backgroundColor: '#007345', 
          color: '#ffffff', 
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '8px',
          borderRadius: '6px',
          display: 'block',
          textAlign: 'center',
          transition: 'background-color 0.2s'
        }}>
          Consulta nuestra guía
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
