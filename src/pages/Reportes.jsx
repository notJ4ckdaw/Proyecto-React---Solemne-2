import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Reportes = () => {
  const { selectedLocal } = useAuth();
  const [reports, setReports] = useState([
    { name: 'Reporte Semanal de Tránsito Térmico', date: '2026-06-21', size: '2.4 MB', type: 'PDF' },
    { name: 'Matriz de Transiciones de Clientes - Pasillos', date: '2026-06-18', size: '1.2 MB', type: 'XLSX' },
    { name: 'Consolidado Mensual de Aforos Máximos', date: '2026-05-31', size: '4.8 MB', type: 'PDF' },
    { name: 'Histórico de Alertas de Saturación', date: '2026-05-15', size: '840 KB', type: 'CSV' }
  ]);

  useEffect(() => {
    document.title = 'Jumbo Cencosud - Centro de Reportes';
  }, []);

  const handleDownload = (reportName) => {
    alert(`Preparando la descarga de: ${reportName}\nModo: Exportación directa de base de datos.`);
  };

  return (
    <section className="page-reports" style={{ padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Centro de Descargas y Reportes</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Exportación de datos históricos y analítica avanzada del supermercado.</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {['PDF', 'Excel', 'CSV'].map((format, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
              {format === 'PDF' ? '📄' : format === 'Excel' ? '📊' : '💾'}
            </div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Exportar en {format}</h3>
            <button 
              onClick={() => handleDownload(`Consolidado Completo - Formato ${format}`)}
              style={{
                marginTop: '0.8rem',
                backgroundColor: '#008751',
                color: '#ffffff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Generar Archivo
            </button>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Documentos Disponibles en Servidor</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Nombre del Reporte</th>
              <th style={{ padding: '1rem 1.5rem' }}>Fecha de Emisión</th>
              <th style={{ padding: '1rem 1.5rem' }}>Tamaño</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem', color: '#334155' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{r.date}</td>
                <td style={{ padding: '1rem 1.5rem' }}><span className="detail-badge static-badge">{r.type}</span> {r.size}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDownload(r.name)}
                    style={{
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      color: '#0f172a',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ⬇️ Descargar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Reportes;
