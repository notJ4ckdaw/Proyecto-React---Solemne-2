import React from 'react';
import { Link } from 'react-router-dom';
import MenuNav from './MenuNav';

const Sidebar = ({ tiendaActiva, setTiendaActiva }) => {
  // Configuración de links para el MenuNav exactos al Mockup
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

  const sucursalesCencosud = [
    "Jumbo Costanera Center",
    "Jumbo Alto Las Condes",
    "Santa Isabel Providencia",
    "Spid Santiago Centro",
    "Easy Ñuñoa"
  ];

  return (
    <aside className="app-sidebar" style={{ position: 'sticky', top: 0, height: '100vh' }}>
      
      {/* 1. CONTENEDOR PRINCIPAL (Logo, Menú y Selectores juntos arriba) */}
      <div>
        {/* Nombre del Supermercado */}
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
            color: '#10b981'
          }}>
            Inteligencia de Espacios
          </span>
        </div>

        {/* Menú de Navegación */}
        <MenuNav links={links} />

        {/* Selectores (Agrupados aquí para que no se bajen) */}
        <div style={{ padding: '0 1rem', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Selector de Sucursal */}
          <div className="floor-selector">
            <div className="floor-title" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Sucursal Seleccionada
            </div>
            <select 
              value={tiendaActiva}
              onChange={(e) => setTiendaActiva(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#007345',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {sucursalesCencosud.map((sucursal, index) => (
                <option key={index} value={sucursal} style={{ backgroundColor: '#0f172a', color: 'white' }}>
                  📍 {sucursal}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Piso */}
          <div className="floor-selector">
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
      </div>

      {/* 2. CONTENEDOR INFERIOR (Ayuda) */}
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