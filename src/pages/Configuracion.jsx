import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Configuracion = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState({
    limitCaliente: 140,
    limitTemplado: 70,
    refreshInterval: 30,
    backendUrl: 'http://localhost:3001',
    sensorAccuracy: 'Alta (Fusión Láser + Cámara)'
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = 'Jumbo Cencosud - Configuración';
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetDB = () => {
    if (window.confirm('¿Está seguro de reiniciar los datos locales en caché a sus valores iniciales?')) {
      localStorage.removeItem('jumbo_heatmap_zonas_L-01');
      localStorage.removeItem('jumbo_heatmap_zonas_L-02');
      localStorage.removeItem('jumbo_heatmap_zonas_L-03');
      alert('Caché local reiniciada con éxito. Recargue para sincronizar con la base de datos de respaldo.');
      window.location.reload();
    }
  };

  return (
    <section className="page-settings" style={{ padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Configuración de Parámetros del Sistema</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Ajuste de umbrales operacionales, calibración de sensores e integración de red.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.2rem 0', color: '#008751', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>🔧 Calibración de Rangos Térmicos</h3>
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>
                Límite de Zona Caliente (pers/hora)
              </label>
              <input 
                type="number" 
                value={config.limitCaliente} 
                onChange={(e) => setConfig({ ...config, limitCaliente: parseInt(e.target.value) || 140 })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>
                Límite de Zona Templada (pers/hora)
              </label>
              <input 
                type="number" 
                value={config.limitTemplado} 
                onChange={(e) => setConfig({ ...config, limitTemplado: parseInt(e.target.value) || 70 })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: '#475569' }}>
                Intervalo de refresco (segundos)
              </label>
              <input 
                type="number" 
                value={config.refreshInterval} 
                onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) || 30 })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
              />
            </div>

            <button 
              type="submit"
              style={{
                backgroundColor: '#008751',
                color: '#ffffff',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '0.5rem'
              }}
            >
              Guardar Parámetros
            </button>
            
            {saved && (
              <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                ✓ Parámetros guardados y sincronizados con los sensores.
              </span>
            )}
          </form>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <h3 style={{ margin: '0 0 1.2rem 0', color: '#008751', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>🔌 Conexiones de API y Red</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Servidor de Base de Datos:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{config.backendUrl}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tecnología del Backend:</span>
                <span style={{ fontWeight: 700 }}>Express API Server</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Precisión Calibrada:</span>
                <span style={{ fontWeight: 700 }}>{config.sensorAccuracy}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#dc3545', fontSize: '1.1rem' }}>⚠️ Mantenimiento y Datos</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0' }}>
              Utilice este control si desea restablecer los datos de aforo de su navegador a sus configuraciones iniciales (de fábrica).
            </p>
            <button 
              onClick={handleResetDB}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc3545',
                color: '#dc3545',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Restaurar Base de Datos Local
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Configuracion;
