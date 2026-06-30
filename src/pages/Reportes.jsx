import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

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

  const generatePDF = (reportName, zonesData, localName) => {
    const lines = [
      `========================================================================`,
      `       REPORTE DE MONITOREO Y TRANSITO TERMICO - JUMBO CENCOSUD`,
      `========================================================================`,
      `Sucursal:  ${localName}`,
      `Reporte:   ${reportName}`,
      `Fecha:     ${new Date().toLocaleDateString('es-CL')}`,
      `Estado:    CONSOLIDADOS DE FLUJO OPERATIVO`,
      `------------------------------------------------------------------------`,
      ` `,
    ];

    for (let p = 1; p <= 3; p++) {
      const floorZones = zonesData.filter(z => (z.piso || "1") === String(p));
      if (floorZones.length > 0) {
        lines.push(`--- PISO ${p} ---`);
        lines.push(`Codigo | Departamento                  | Transito | Estado   | Aforo Max`);
        lines.push(`-------|-------------------------------|----------|----------|----------`);
        floorZones.forEach(z => {
          const codePad = z.codigo.padEnd(6);
          const namePad = z.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 29).padEnd(29);
          const cantPad = String(z.cantidad).padEnd(8);
          const estPad = z.estado.padEnd(8);
          const aforoPad = String(z.aforoMax).padEnd(9);
          lines.push(`${codePad} | ${namePad} | ${cantPad} | ${estPad} | ${aforoPad}`);
        });
        lines.push(`------------------------------------------------------------------------`);
        lines.push(` `);
      }
    }

    lines.push(`========================================================================`);
    lines.push(`Generado automaticamente por el Algoritmo VCM - Jumbo Heatmap System.`);
    lines.push(`========================================================================`);

    let streamContent = "BT\n/F1 8 Tf\n11 TL\n40 730 Td\n";
    lines.forEach(line => {
      const escapedLine = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      streamContent += `(${escapedLine}) Tj T*\n`;
    });
    streamContent += "ET";

    const catalogObj = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
    const pagesObj = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
    const fontObj = "<< /F1 << /Type /Font /Subtype /Type1 /BaseFont /Courier >> >>";
    const pageObj = `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font ${fontObj} >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n`;
    const contentStream = `4 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
    
    const header = "%PDF-1.4\n";
    const o1 = header.length;
    const o2 = o1 + catalogObj.length;
    const o3 = o2 + pagesObj.length;
    const o4 = o3 + pageObj.length;
    const xrefOffset = o4 + contentStream.length;

    const xref = `xref\n0 5\n0000000000 65535 f \n${String(o1).padStart(10, '0')} 00000 n \n${String(o2).padStart(10, '0')} 00000 n \n${String(o3).padStart(10, '0')} 00000 n \n${String(o4).padStart(10, '0')} 00000 n \n`;
    const trailer = `trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    const pdfContent = header + catalogObj + pagesObj + pageObj + contentStream + xref + trailer;
    
    const enc = new TextEncoder();
    return new Blob([enc.encode(pdfContent)], { type: 'application/pdf' });
  };

  const handleDownload = (reportName, formatType) => {
    const localStoredZones = localStorage.getItem(`jumbo_heatmap_zonas_${selectedLocal}`);
    let zonesData = [];
    if (localStoredZones) {
      try {
        zonesData = JSON.parse(localStoredZones);
      } catch (e) {
        zonesData = FALLBACK_ZONAS[selectedLocal] || [];
      }
    } else {
      zonesData = FALLBACK_ZONAS[selectedLocal] || [];
    }

    const localesNames = {
      'L-01': 'Jumbo Costanera Center',
      'L-02': 'Jumbo Alto Las Condes',
      'L-03': 'Jumbo El Llano'
    };
    const localName = localesNames[selectedLocal] || 'Jumbo Costanera Center';

    const formatUpper = String(formatType).toUpperCase();
    let blob;
    let fileName = '';

    if (formatUpper.includes('PDF')) {
      blob = generatePDF(reportName, zonesData, localName);
      fileName = `${reportName.replace(/\s+/g, '_')}_${selectedLocal}.pdf`;
    } else {
      // CSV o Excel (delimitado por punto y coma, con BOM UTF-8)
      let fileContent = '\uFEFF'; // BOM UTF-8
      fileContent += 'ID;Código;Piso;Nombre;Estado;Cantidad (personas/hora);Aforo Máximo\n';
      zonesData.forEach(z => {
        fileContent += `${z.id};${z.codigo};${z.piso || '1'};${z.nombre};${z.estado};${z.cantidad};${z.aforoMax}\n`;
      });
      blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
      fileName = `${reportName.replace(/\s+/g, '_')}_${selectedLocal}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              onClick={() => handleDownload(`Consolidado Completo`, format)}
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
                    onClick={() => handleDownload(r.name, r.type)}
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
