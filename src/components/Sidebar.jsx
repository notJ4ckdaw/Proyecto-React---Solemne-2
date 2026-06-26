import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuNav from './MenuNav';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_LOCALES } from '../data/fallbackData';

const Sidebar = () => {
  const { user, selectedLocal, changeLocal, selectedFloor, changeFloor, logout } = useAuth();
  const [locales, setLocales] = useState(FALLBACK_LOCALES);

  // Configuración de links para el MenuNav
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

  // Cargar locales desde la API si es jefe general
  useEffect(() => {
    if (user && user.rol === 'jefe_general') {
      fetch('http://localhost:3001/api/locales', {
        headers: {
          'Authorization': user.token
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setLocales(data);
          }
        })
        .catch((err) => console.error('Error cargando locales:', err));
    }
  }, [user]);

  return (
    <aside className="app-sidebar" style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      
      {/* SECCIÓN SUPERIOR: Logo y Menú */}
      <div>
        {/* Nombre del Supermercado */}
        <div className="brand" style={{ marginBottom: '2rem', textAlign: 'left', paddingLeft: '1rem', paddingTop: '1rem' }}>
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

        {/* Selectores y Estado de Sucursal */}
        <div style={{ padding: '0 1rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Selector de Sucursal (Restringido por Rol) */}
          <div className="floor-selector">
            <div className="floor-title" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Sucursal Monitoreada
            </div>
            
            {user && user.rol === 'jefe_general' ? (
              // Jefe General: Puede cambiar entre todos los locales
              <select 
                value={selectedLocal}
                onChange={(e) => changeLocal(e.target.value)}
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
                {locales.map((loc) => (
                  <option key={loc.id} value={loc.id} style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    📍 {loc.nombre}
                  </option>
                ))}
              </select>
            ) : (
              // Jefe de Local: Sucursal estática bloqueada
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                📍 Jumbo Costanera Center
              </div>
            )}
          </div>

          {/* Selector de Piso */}
          <div className="floor-selector">
            <div className="floor-title" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Piso Seleccionado
            </div>
            <select 
              value={selectedFloor}
              onChange={(e) => changeFloor(e.target.value)}
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
              <option value="1" style={{ backgroundColor: '#0f172a', color: 'white' }}>🟢 Piso 1 (Planta Baja)</option>
              <option value="2" style={{ backgroundColor: '#0f172a', color: 'white' }}>🔵 Piso 2 (Tecnología y Ropa)</option>
              <option value="3" style={{ backgroundColor: '#0f172a', color: 'white' }}>🟡 Piso 3 (Hogar y Deportes)</option>
            </select>
          </div>

        </div>
      </div>

      {/* SECCIÓN INFERIOR: Perfil de Usuario y Cerrar Sesión */}
      <div>
        {user && (
          <div style={{ 
            padding: '1rem', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.8rem' 
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>👤 {user.nombre}</span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                {user.rol === 'jefe_general' ? '👑 Administrador General' : '💼 Jefe de Local'}
              </span>
            </div>
            <button 
              onClick={logout}
              style={{
                width: '100%',
                backgroundColor: '#dc3545',
                color: '#ffffff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              type="button"
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        <div className="sidebar-help" style={{ padding: '1rem' }}>
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
            ❔ Ayuda y Soporte
          </Link>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;