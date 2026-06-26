import React from 'react';
import { Link } from 'react-router-dom';

const MaterialCard = ({ id, nombre, codigo, estado, cantidad, imagen }) => {
  return (
    <article className="material-card" id={`zone-card-${codigo}`}>
      {/* Estructura semántica obligatoria: figure y figcaption */}
      <figure className="card-figure">
        <img 
          src={imagen} 
          alt={`Vista del departamento ${nombre} del supermercado`} 
          loading="lazy" 
        />
        <figcaption className={`card-badge ${estado}`}>
          {estado === 'caliente' && '🔥 Tráfico Alto'}
          {estado === 'templado' && '⚡ Tráfico Medio'}
          {estado === 'frio' && '❄️ Tráfico Bajo'}
        </figcaption>
      </figure>

      <div className="card-header-info">
        <h3 className="card-title">{nombre}</h3>
        <span className="card-code" title="Código de Zona">{codigo}</span>
      </div>

      <div className="card-body-info">
        <div className="card-meta-row">
          <span className="meta-label">Flujo de Tránsito:</span>
          <span className="meta-value">{cantidad} personas/hora</span>
        </div>
        <div className="card-meta-row">
          <span className="meta-label">Estado de Zona:</span>
          <span className="meta-value" style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
            {estado}
          </span>
        </div>
      </div>

      <div className="card-actions">
        <Link 
          to={`/materiales/${codigo}`} 
          className="btn-detail"
          aria-label={`Ver análisis de flujo detallado para la zona ${nombre}`}
        >
          Ver Análisis Detallado
        </Link>
      </div>
    </article>
  );
};

export default MaterialCard;
