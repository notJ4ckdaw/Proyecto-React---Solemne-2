import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

const Alertas = () => {
  const { selectedLocal } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterFloor, setFilterFloor] = useState('todos'); // 'todos', '1', '2', '3'

  useEffect(() => {
    document.title = 'Jumbo Cencosud - Alertas de Tránsito';
    setLoading(true);

    fetch(`http://localhost:3001/api/zonas/${selectedLocal}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          generateAlerts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend offline, generando alertas locales:', err);
        const localStoredZones = localStorage.getItem(`jumbo_heatmap_zonas_${selectedLocal}`);
        const defaultZones = localStoredZones ? JSON.parse(localStoredZones) : (FALLBACK_ZONAS[selectedLocal] || []);
        generateAlerts(defaultZones);
        setLoading(false);
      });
  }, [selectedLocal]);

  const generateAlerts = (zones) => {
    const activeAlerts = [];
    
    // Alertas dinámicas generadas desde el backend para todos los pisos
    zones.forEach(z => {
      const floorNum = parseInt(z.piso || '1', 10);
      const occupancyRate = Math.round((z.cantidad / z.aforoMax) * 100);
      if (z.estado === 'caliente' || occupancyRate >= 90) {
        activeAlerts.push({
          id: `${floorNum}-${z.codigo}`,
          piso: `Piso ${floorNum}`,
          pisoNum: floorNum,
          zoneName: z.nombre,
          type: occupancyRate >= 100 ? 'critica' : 'advertencia',
          message: occupancyRate >= 100 
            ? `¡Aforo superado! Concentración en ${z.nombre} de ${z.cantidad} pers/h (Aforo Máx: ${z.aforoMax}).`
            : `Tránsito elevado en ${z.nombre} (${z.cantidad} pers/h). Ocupación del ${occupancyRate}%.`,
          time: 'Hace 5 minutos'
        });
      }
    });

    setAlerts(activeAlerts);
  };

  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Filtrar alertas según el piso seleccionado en la pestaña
  const filteredAlerts = alerts.filter(alert => {
    if (filterFloor === 'todos') return true;
    return alert.pisoNum.toString() === filterFloor;
  });

  return (
    <section className="page-alerts" style={{ padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Panel de Alertas Operacionales</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Monitoreo en tiempo real de saturación de aforo y cuellos de botella en todos los niveles.</p>
      </header>

      {/* Selector de Pestañas / Filtro de Pisos */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem'
      }}>
        {[
          { id: 'todos', label: '📢 Todos los Pisos' },
          { id: '1', label: '🟢 Piso 1 (Planta Baja)' },
          { id: '2', label: '🔵 Piso 2 (Tecnología y Ropa)' },
          { id: '3', label: '🟡 Piso 3 (Hogar y Deportes)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterFloor(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: filterFloor === tab.id ? '#00875A' : '#f1f5f9',
              color: filterFloor === tab.id ? '#ffffff' : '#64748b',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando alertas...</p>
      ) : filteredAlerts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAlerts.map((alert, idx) => (
            <div key={idx} style={{
              backgroundColor: alert.type === 'critica' ? '#fff5f5' : '#fffbeb',
              border: `1px solid ${alert.type === 'critica' ? '#feb2b2' : '#fde68a'}`,
              borderRadius: '10px',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
              animation: 'fadeIn 0.3s ease-in'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.8rem' }}>{alert.type === 'critica' ? '🚨' : '⚠️'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: alert.type === 'critica' ? '#9b2c2c' : '#975a16', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: alert.pisoNum === 1 ? '#e6f4ea' : alert.pisoNum === 2 ? '#e8f0fe' : '#fef7e0',
                      color: alert.pisoNum === 1 ? '#137333' : alert.pisoNum === 2 ? '#1a73e8' : '#b06000',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      {alert.piso}
                    </span>
                    <span>{alert.type === 'critica' ? 'ALERTA CRÍTICA' : 'ADVERTENCIA'} - {alert.zoneName}</span>
                  </h3>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#4a5568' }}>{alert.message}</p>
                  <span style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginTop: '4px' }}>{alert.time}</span>
                </div>
              </div>

              <button
                onClick={() => handleResolveAlert(alert.id)}
                style={{
                  backgroundColor: '#ffffff',
                  border: `1px solid ${alert.type === 'critica' ? '#fc8181' : '#f6ad55'}`,
                  color: alert.type === 'critica' ? '#c53030' : '#dd6b20',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                Mitigar / Resolver
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center',
          color: '#1e40af'
        }}>
          <span style={{ fontSize: '2.5rem' }}>✅</span>
          <h3 style={{ margin: '0.5rem 0 0 0' }}>Estado Normal de Flujos</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>No se registran alertas de saturación ni aforos críticos en este nivel.</p>
        </div>
      )}
    </section>
  );
};

export default Alertas;
