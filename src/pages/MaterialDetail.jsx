import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inicialMateriales } from '../data/materiales';

const MaterialDetail = () => {
  // useParams para obtener el ID de la ruta (Hook Obligatorio 4.2)
  const { id } = useParams();
  
  // Buscar la zona correspondiente en los datos estáticos
  const zona = inicialMateriales.find(m => m.id === parseInt(id));

  // Cambiar el título del documento dinámicamente en base a la zona (Hook Obligatorio 4.2)
  useEffect(() => {
    if (zona) {
      document.title = `Jumbo Cencosud - Detalle ${zona.nombre}`;
    } else {
      document.title = 'Jumbo Cencosud - Zona no encontrada';
    }
  }, [zona]);

  if (!zona) {
    return (
      <section style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2>⚠️ Departamento no encontrado</h2>
        <p style={{ margin: '1rem 0', color: '#64748b' }}>El identificador de la zona no coincide con nuestros registros locales.</p>
        <Link to="/materiales" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
          Volver a Zonas
        </Link>
      </section>
    );
  }

  // Generar recomendaciones dinámicas basadas en la "temperatura" (estado) de la zona
  const obtenerRecomendaciones = (estado) => {
    switch (estado) {
      case 'caliente':
        return [
          {
            titulo: "Ubicación de Productos de Impulso",
            descripcion: "Al ser una zona de alta afluencia de clientes, se recomienda colocar golosinas, revistas, bebidas o productos en promoción de compra rápida cerca de este sector."
          },
          {
            titulo: "Puntos de Información y Señalética",
            descripcion: "Asegurar que la señalética en este sector esté despejada y visible, ya que es vista por la gran mayoría de visitantes diarios."
          },
          {
            titulo: "Espacio de Circulación Amplio",
            descripcion: "Evitar obstrucciones o exhibidores de gran tamaño en el pasillo que puedan estrangular el paso e incomodar a los clientes."
          }
        ];
      case 'templado':
        return [
          {
            titulo: "Colocación de Productos de Consumo Diario",
            descripcion: "Ideal para alimentos envasados, aseo y artículos de despensa regular. Es un tránsito estable que asegura una visualización continua."
          },
          {
            titulo: "Promociones Cruzadas",
            descripcion: "Coloque carteles promocionales que dirijan a los clientes hacia las 'zonas frías' adyacentes de la tienda para equilibrar el flujo."
          }
        ];
      case 'frio':
        return [
          {
            titulo: "Colocación de Productos Gancho (Destino)",
            descripcion: "Mueva productos esenciales y de compra obligatoria (ej: leche, pan, huevos) al fondo de esta zona fría. Los clientes se verán obligados a entrar a este pasillo, calentando el tráfico."
          },
          {
            titulo: "Iluminación y Decoración Reforzada",
            descripcion: "Las zonas frías suelen percibirse como oscuras o de difícil acceso. Mejore la iluminación y coloque carteles llamativos para hacer la zona más atractiva."
          },
          {
            titulo: "Ofertas y Descuentos Exclusivos",
            descripcion: "Coloque la cabecera de góndola de esta zona con ofertas agresivas del 50% de descuento para atraer miradas e inducir el tránsito."
          }
        ];
      default:
        return [];
    }
  };

  const recomendaciones = obtenerRecomendaciones(zona.estado);

  return (
    <section className="page-detail">
      {/* Encabezado del Detalle */}
      <div className="detail-header">
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
            Análisis de Flujo de Clientes
          </h2>
          <span style={{ fontSize: '0.9rem', color: '#475569' }}>
            Reporte detallado de circulación y distribución física
          </span>
        </div>
        <Link to="/materiales" className="btn-back">
          ← Volver a Zonas
        </Link>
      </div>

      {/* Grid de Detalle (HTML5 Semántico) */}
      <div className="detail-grid">
        {/* Imagen representativa */}
        <article className="detail-image-card">
          <img src={zona.imagen} alt={`Fotografía del departamento de ${zona.nombre}`} />
        </article>

        {/* Información Técnica */}
        <section className="detail-info-card" aria-label="Información de métricas de la zona">
          <div className="info-header">
            <span className={`detail-badge ${zona.estado}`}>
              {zona.estado === 'caliente' && '🔥 Zona Caliente'}
              {zona.estado === 'templado' && '⚡ Zona Templada'}
              {zona.estado === 'frio' && '❄️ Zona Fría'}
            </span>
            <h2>{zona.nombre}</h2>
          </div>

          <div className="info-body">
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              El departamento <strong>{zona.nombre}</strong> (identificado con el código de inventario <strong>{zona.codigo}</strong>) 
              registra actualmente un flujo promedio de <strong>{zona.cantidad} clientes por hora</strong>.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Código del Sensor:</span>
                <span style={{ fontWeight: 600 }}>SEN-{zona.codigo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Estado del Canal:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Conectado (Online)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Último Reporte:</span>
                <span style={{ fontWeight: 600 }}>Hoy, hace 15 minutos</span>
              </div>
            </div>
          </div>

          <div className="info-footer">
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
              * Los datos mostrados corresponden al consolidado del periodo de 20 días.
            </span>
          </div>
        </section>
      </div>

      {/* Recomendaciones de Diseño de Distribución de Tienda */}
      <section className="detail-recommendations" aria-label="Recomendaciones de layout">
        <h3>Recomendaciones del Algoritmo VCM para la Zona</h3>
        <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          Basándonos en la clasificación de tráfico <strong>{zona.estado.toUpperCase()}</strong>, los analistas de operaciones y logística recomiendan:
        </p>

        {recomendaciones.map((rec, index) => (
          <div key={index} className="rec-item">
            <h4>{rec.titulo}</h4>
            <p>{rec.descripcion}</p>
          </div>
        ))}
      </section>
    </section>
  );
};

export default MaterialDetail;
