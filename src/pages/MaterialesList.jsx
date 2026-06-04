import React, { useState, useEffect } from 'react';
import { inicialMateriales } from '../data/materiales';
import MaterialCard from '../components/MaterialCard';
import Mensaje from '../components/Mensaje';

const MaterialesList = () => {
  // 1. Estados principales (RF-05, RNF-04)
  const [materiales, setMateriales] = useState(inicialMateriales);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMateriales, setFilteredMateriales] = useState(inicialMateriales);

  // Estados del Formulario (Hook Obligatorio 4.2)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    codigo: '',
    estado: 'caliente',
    cantidad: '',
    imagen: ''
  });
  
  // Estado para mensajes de confirmación (Hook Obligatorio 4.2)
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // 2. useEffect para filtrado reactivo de zonas (Hook Obligatorio 4.2)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filtered = materiales.filter(m =>
        m.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.codigo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMateriales(filtered);
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchQuery, materiales]);

  // Cambiar el título del documento al cargar
  useEffect(() => {
    document.title = 'VCM HeatMap - Zonas';
  }, []);

  // 3. Manejo de inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? parseInt(value) || '' : value
    }));
    
    // Limpiar errores visuales al escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 4. Validación visual y lógica de guardado (RF-02, RF-03)
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre de la zona es obligatorio.';
    if (!formData.codigo.trim()) {
      errors.codigo = 'El código es obligatorio.';
    } else if (!isEditing && materiales.some(m => m.codigo.toUpperCase() === formData.codigo.toUpperCase())) {
      errors.codigo = 'Este código de zona ya está registrado.';
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      errors.cantidad = 'El flujo debe ser un número mayor a cero.';
    }
    if (!formData.imagen.trim()) {
      errors.imagen = 'La URL de la imagen es obligatoria.';
    } else if (!formData.imagen.startsWith('http')) {
      errors.imagen = 'Ingrese una URL válida (iniciando con http/https).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMensaje({
        tipo: 'error',
        texto: 'Por favor, corrija los campos marcados en rojo antes de enviar.'
      });
      return;
    }

    if (isEditing) {
      // Modificación de zona existente
      setMateriales(prev => prev.map(m => m.id === formData.id ? { ...formData, codigo: formData.codigo.toUpperCase() } : m));
      setMensaje({
        tipo: 'exito',
        texto: `¡Zona ${formData.nombre} actualizada correctamente!`
      });
    } else {
      // Registro de nueva zona
      const nuevaZona = {
        ...formData,
        id: materiales.length > 0 ? Math.max(...materiales.map(m => m.id)) + 1 : 1,
        codigo: formData.codigo.toUpperCase()
      };
      setMateriales(prev => [...prev, nuevaZona]);
      setMensaje({
        tipo: 'exito',
        texto: `¡Zona ${formData.nombre} registrada correctamente en el sistema!`
      });
    }

    // Resetear formulario
    handleReset();
    
    // Ocultar mensaje automáticamente después de 4 segundos
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 4000);
  };

  const handleEditClick = (zona) => {
    setFormData(zona);
    setIsEditing(true);
    setMensaje({ tipo: '', texto: '' });
    
    // Auto-scroll al formulario
    const formElement = document.getElementById('admin-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setFormData({
      id: '',
      nombre: '',
      codigo: '',
      estado: 'caliente',
      cantidad: '',
      imagen: ''
    });
    setFormErrors({});
    setIsEditing(false);
  };

  return (
    <section className="page-zones">
      <h2 className="section-title">Mapa de Calor y Zonas del Supermercado</h2>
      <p className="section-description">
        Monitoreo en tiempo real del tráfico de clientes. Haz clic en las zonas del mapa para ver detalles o utiliza el formulario de abajo para actualizar datos.
      </p>

      {/* 1. Componente de Mapa de Calor Visual Interactivo (del wireframe) */}
      <div className="heatmap-container">
        <div className="heatmap-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Mapa Central - Distribución Planta Baja (Piso 1)
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
            🟢 Datos Sensores Activos | Carga: 100%
          </span>
        </div>

        {/* Grilla CSS Grid del layout de la tienda */}
        <div className="heatmap-grid" role="img" aria-label="Plano de distribución del supermercado coloreado por tráfico">
          {materiales.slice(0, 6).map((m) => (
            <div 
              key={m.id} 
              className={`zone-cell ${m.estado}`}
              onClick={() => handleEditClick(m)}
              title={`Clic para editar tráfico de ${m.nombre}`}
            >
              <div className="zone-name">{m.nombre}</div>
              <div className="zone-traffic">{m.cantidad} pers/h</div>
              <div className="zone-hover-tip">Editar Datos ⚙️</div>
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="heatmap-legend">
          <div className="legend-item">
            <span className="dot hot"></span>
            <span>Tránsito Alto / Zona Caliente (&gt;150 pers/h)</span>
          </div>
          <div className="legend-item">
            <span className="dot warm"></span>
            <span>Tránsito Medio / Zona Templada (70-150 pers/h)</span>
          </div>
          <div className="legend-item">
            <span className="dot cold"></span>
            <span>Tránsito Bajo / Zona Fría (&lt;70 pers/h)</span>
          </div>
        </div>
      </div>

      {/* 2. Barra de Búsqueda y Filtro Reactivo */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <label htmlFor="search-input" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569', whiteSpace: 'nowrap' }}>
          🔍 Buscar Zona:
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Escribe el nombre o código de zona (ej: Lácteos o Z-04)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flexGrow: 1,
            padding: '0.5rem 1rem',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ef4444',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            type="button"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Mensaje de Retroalimentación Obligatorio (RF-03, 4.2) */}
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      {/* 3. Listado de Zonas usando el Componente Reutilizable MaterialCard (RF-02) */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
        Registro de Departamentos ({filteredMateriales.length})
      </h3>
      
      <div className="zones-flex-container">
        {filteredMateriales.length > 0 ? (
          filteredMateriales.map((m) => (
            <MaterialCard 
              key={m.id}
              id={m.id}
              nombre={m.nombre}
              codigo={m.codigo}
              estado={m.estado}
              cantidad={m.cantidad}
              imagen={m.imagen}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <p style={{ marginTop: '1rem', fontWeight: 600 }}>No se encontraron zonas que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>

      {/* 4. Panel Administrativo (Formulario de Registro/Actualización) - Cumple RF-02, 4.2 */}
      <div className="admin-panel" id="admin-form">
        
        {/* Formulario */}
        <div className="form-container">
          <h3>{isEditing ? '⚙️ Actualizar Tránsito de Zona' : '➕ Registrar Nueva Zona de Tienda'}</h3>
          
          <form onSubmit={handleSubmit} noValidate>
            
            {/* Campo 1: Nombre (Dropdown para garantizar datos limpios) */}
            <div className={`form-group ${formErrors.nombre ? 'invalid' : ''}`}>
              <label htmlFor="nombre-input">Nombre del Departamento</label>
              <input
                id="nombre-input"
                type="text"
                name="nombre"
                placeholder="Ej. Panadería, Carnicería, Fiambrería..."
                value={formData.nombre}
                onChange={handleInputChange}
                aria-invalid={formErrors.nombre ? "true" : "false"}
                aria-describedby={formErrors.nombre ? "nombre-error" : undefined}
              />
              {formErrors.nombre && (
                <span id="nombre-error" className="error-msg">{formErrors.nombre}</span>
              )}
            </div>

            {/* Campo 2: Código */}
            <div className={`form-group ${formErrors.codigo ? 'invalid' : ''}`}>
              <label htmlFor="codigo-input">Código de Zona (Prefijo Z-XX)</label>
              <input
                id="codigo-input"
                type="text"
                name="codigo"
                placeholder="Ej. Z-07"
                value={formData.codigo}
                onChange={handleInputChange}
                disabled={isEditing} // No editable al actualizar
                aria-invalid={formErrors.codigo ? "true" : "false"}
                aria-describedby={formErrors.codigo ? "codigo-error" : undefined}
              />
              {formErrors.codigo && (
                <span id="codigo-error" className="error-msg">{formErrors.codigo}</span>
              )}
            </div>

            {/* Campo 3: Estado / Intensidad (Dropdown) */}
            <div className="form-group">
              <label htmlFor="estado-select">Estado de Tránsito (Escala Térmica)</label>
              <select
                id="estado-select"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="caliente">🔥 Caliente (Flujo Alto)</option>
                <option value="templado">⚡ Templado (Flujo Medio)</option>
                <option value="frio">❄️ Frío (Flujo Bajo)</option>
              </select>
            </div>

            {/* Campo 4: Cantidad (Flujo) */}
            <div className={`form-group ${formErrors.cantidad ? 'invalid' : ''}`}>
              <label htmlFor="cantidad-input">Flujo de Tránsito (Clientes / Hora)</label>
              <input
                id="cantidad-input"
                type="number"
                name="cantidad"
                placeholder="Ej. 130"
                value={formData.cantidad}
                onChange={handleInputChange}
                aria-invalid={formErrors.cantidad ? "true" : "false"}
                aria-describedby={formErrors.cantidad ? "cantidad-error" : undefined}
              />
              {formErrors.cantidad && (
                <span id="cantidad-error" className="error-msg">{formErrors.cantidad}</span>
              )}
            </div>

            {/* Campo 5: URL de Imagen */}
            <div className={`form-group ${formErrors.imagen ? 'invalid' : ''}`}>
              <label htmlFor="imagen-input">URL de la Imagen Ilustrativa</label>
              <input
                id="imagen-input"
                type="text"
                name="imagen"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.imagen}
                onChange={handleInputChange}
                aria-invalid={formErrors.imagen ? "true" : "false"}
                aria-describedby={formErrors.imagen ? "imagen-error" : undefined}
              />
              {formErrors.imagen && (
                <span id="imagen-error" className="error-msg">{formErrors.imagen}</span>
              )}
            </div>

            {/* Botones de acción */}
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                {isEditing ? 'Guardar Cambios' : 'Registrar Zona'}
              </button>
              <button type="button" className="btn-reset" onClick={handleReset}>
                {isEditing ? 'Cancelar' : 'Limpiar'}
              </button>
            </div>

          </form>
        </div>

        {/* Panel Informativo de Instrucciones */}
        <div className="admin-info">
          <h3>Guía Administrativa</h3>
          <p>
            El registro de zonas es fundamental para que el mapa de calor central se actualice de forma dinámica. 
            El algoritmo clasifica las zonas automáticamente:
          </p>
          <ul className="rules-list">
            <li><strong>Zonas Calientes (Rojo)</strong>: Espacios con flujo superior a 150 clientes/hora. Ideales para colocar promociones o productos de alto margen.</li>
            <li><strong>Zonas Templadas (Naranja)</strong>: Flujo entre 70 y 150 clientes/hora. Pasillos de tránsito normal.</li>
            <li><strong>Zonas Frías (Azul)</strong>: Flujo menor a 70 clientes/hora. Zonas críticas que requieren rediseño del layout o colocación de productos gancho.</li>
          </ul>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.6 }}>
            * Nota: Los datos almacenados son locales e interactivos dentro del estado de React (useState).
          </p>
        </div>

      </div>
    </section>
  );
};

export default MaterialesList;
