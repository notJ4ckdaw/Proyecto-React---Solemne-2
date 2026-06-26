import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

const Trafico = () => {
  const { selectedLocal } = useAuth();
  const [floorData, setFloorData] = useState([
    { floor: 'Piso 1 (Abarrotes y Alimentos)', traffic: 75, status: 'caliente', sensors: 8, avgTime: '36 min' },
    { floor: 'Piso 2 (Hogar y Electro)', traffic: 38, status: 'templado', sensors: 5, avgTime: '22 min' },
    { floor: 'Piso 3 (Vestuario y Juguetes)', traffic: 15, status: 'frio', sensors: 3, avgTime: '12 min' }
  ]);

  useEffect(() => {
    document.title = 'Jumbo Cencosud - Tráfico por Piso';
    
    // Simulate fetching traffic breakdown
    fetch(`http://localhost:3001/api/zonas/${selectedLocal}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Dynamically compute Floor 1 traffic from active zones
          const avgQty = Math.round(data.reduce((acc, curr) => acc + curr.cantidad, 0) / data.length);
          setFloorData(prev => [
            { ...prev[0], traffic: Math.min(100, Math.round(avgQty / 2)), avgTime: '36 min' },
            { ...prev[1], traffic: Math.round(avgQty / 4) },
            { ...prev[2], traffic: Math.round(avgQty / 8) }
          ]);
        }
      })
      .catch(err => {
        console.warn('Backend offline, calculando tráfico localmente:', err);
        // Offline calculation from fallback data
        const localStoredZones = localStorage.getItem(`jumbo_heatmap_zonas_${selectedLocal}`);
        const defaultZones = localStoredZones ? JSON.parse(localStoredZones) : (FALLBACK_ZONAS[selectedLocal] || []);
        const avgQty = Math.round(defaultZones.reduce((acc, curr) => acc + curr.cantidad, 0) / defaultZones.length);
        setFloorData(prev => [
          { ...prev[0], traffic: Math.min(100, Math.round(avgQty / 2)) },
          { ...prev[1], traffic: Math.round(avgQty / 4) },
          { ...prev[2], traffic: Math.round(avgQty / 8) }
        ]);
      });
  }, [selectedLocal]);

  return (
    <section className="page-traffic" style={{ padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Distribución de Tránsito por Pisos</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Análisis comparativo de circulación de clientes en niveles múltiples.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {floorData.map((f, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ flex: '1 1 250px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#008751' }}>{f.floor}</span>
                <span className={`detail-badge ${f.status}`} style={{ textTransform: 'capitalize', fontSize: '0.75rem', padding: '2px 8px' }}>
                  {f.status === 'caliente' ? '🔥 Flujo Alto' : f.status === 'templado' ? '⚡ Flujo Medio' : '❄️ Flujo Bajo'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                <span>🔌 Sensores activos: <strong>{f.sensors}</strong></span>
                <span>🕒 Permanencia promedio: <strong>{f.avgTime}</strong></span>
              </div>
            </div>

            <div style={{ flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flexGrow: 1, backgroundColor: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  backgroundColor: f.status === 'caliente' ? '#ef4444' : f.status === 'templado' ? '#f59e0b' : '#38bdf8',
                  width: `${f.traffic}%`,
                  height: '100%',
                  borderRadius: '6px',
                  transition: 'width 0.5s ease-in-out'
                }}></div>
              </div>
              <span style={{ fontWeight: 800, color: '#0f172a', width: '50px', textAlign: 'right' }}>{f.traffic}%</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '2rem',
        backgroundColor: '#e8f5e9',
        border: '1px solid #c8e6c9',
        borderRadius: '8px',
        padding: '1rem',
        color: '#2e7d32',
        fontSize: '0.9rem'
      }}>
        💡 <strong>Recomendación Logística:</strong> El Piso 1 concentra el 75% del tráfico debido al acceso directo a cajas de pago. Se sugiere redistribuir campañas promocionales hacia el Piso 2 en horarios punta para equilibrar los flujos de tránsito.
      </div>
    </section>
  );
};

export default Trafico;
