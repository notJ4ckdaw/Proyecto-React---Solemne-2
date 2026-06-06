import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  // useEffect para cambio de título de la página (Hook Obligatorio de Rúbrica 4.2)
  useEffect(() => {
    document.title = 'Jumbo Cencosud - Inicio';
  }, []);

  return (
    <section className="page-home">
      {/* Banner de Bienvenida */}
      <div className="welcome-banner">
        <div className="banner-content">
          <h1>Sistema de Mapa de Calor <span>Jumbo Cencosud</span></h1>
          <p>
            Una iniciativa de Vinculación con el Medio (VCM) que conecta analítica de datos de la escuela 
            de ingeniería con Jumbo (Cencosud) de la comunidad local. Permite mapear y entender de forma objetiva 
            los patrones de circulación de clientes dentro del supermercado para optimizar el layout, 
            mejorar las operaciones y eliminar las "zonas frías" de baja afluencia.
          </p>
          <Link to="/materiales" className="btn-submit" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto' }}>
            Ir al Mapa de Calor 🔥
          </Link>
        </div>
        <div className="banner-shapes"></div>
      </div>

      {/* Cuadrícula de Métricas Resumen - Cumple RF-01 */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
        Resumen Estadístico General
      </h2>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total de Zonas Monitoreadas</div>
          <div className="metric-value">8 Sectores</div>
          <div className="metric-sub positive">🟢 100% de los sensores activos</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Zonas en Estado Crítico</div>
          <div className="metric-value">4 Calientes</div>
          <div className="metric-sub negative">🔥 Flujo superior a 140 pers/h</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Último Ingreso / Registro</div>
          <div className="metric-value" style={{ fontSize: '1.4rem', padding: '0.2rem 0' }}>Caja / Checkout</div>
          <div className="metric-sub positive">⚡ Hace 15 minutos (Z-06)</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Tiempo Promedio en Tienda</div>
          <div className="metric-value">36:45 min</div>
          <div className="metric-sub positive">📈 +8,3% vs. Semana anterior</div>
        </div>
      </div>

      {/* Propósito VCM */}
      <div className="vcm-explanation">
        <h2>Impacto y Objetivos del Proyecto VCM</h2>
        <p>
          Este sistema frontend funcional ayuda a los administradores a visualizar rápidamente qué áreas del 
          establecimiento están registrando flujos de personas subóptimos. Esto reemplaza las suposiciones y 
          el conteo manual por reportes visuales instantáneos basados en colores (Escala de Calor).
        </p>
        
        <div className="features-list">
          <div className="feature-item">
            <h3>Optimización de Layout</h3>
            <p>
              Reubica productos clave y exhibiciones promocionales basándote en flujos calientes y templados.
            </p>
          </div>
          
          <div className="feature-item">
            <h3>Gestión de Personal</h3>
            <p>
              Planifica refuerzos en la zona de cajas o pasillos específicos durante horas de alta concentración.
            </p>
          </div>

          <div className="feature-item">
            <h3>Decisiones Científicas</h3>
            <p>
              Evalúa el impacto real de las modificaciones de estanterías comparando los datos semanales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
