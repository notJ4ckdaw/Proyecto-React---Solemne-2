import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

const Alertas = () => {
  const { selectedLocal } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    zones.forEach(z => {
      // Alert triggers when occupancy exceeds 90% or flow is caliente
      const occupancyRate = Math.round((z.cantidad / z.aforoMax) * 100);
      if (z.estado === 'caliente' || occupancyRate >= 90) {
        activeAlerts.push({
          id: z.codigo,
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

  return (
    <section className="page-alerts" style={{ padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Panel de Alertas Operacionales</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Monitoreo en tiempo real de saturación de aforo y cuellos de botella.</p>
      </header>

      {loading ? (
        <p>Cargando alertas...</p>
      ) : alerts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {alerts.map((alert, idx) => (
            <div key={idx} style={{
              backgroundColor: alert.type === 'critica' ? '#fff5f5' : '#fffbeb',
              border: `1px solid ${alert.type === 'critica' ? '#feb2b2' : '#fde68a'}`,
              borderRadius: '10px',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.8rem' }}>{alert.type === 'critica' ? '🚨' : '⚠️'}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: alert.type === 'critica' ? '#9b2c2c' : '#975a16' }}>
                    {alert.type === 'critica' ? 'ALERTA CRÍTICA' : 'ADVERTENCIA'} - {alert.zoneName}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#4a5568' }}>{alert.message}</p>
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
                  cursor: 'pointer'
                }}
              >
                Mitar / Resolver
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
          <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>No se registran alertas de saturación ni aforos críticos en las sucursales.</p>
        </div>
      )}
    </section>
  );
};

export default Alertas;
