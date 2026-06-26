import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaterialCard from '../components/MaterialCard';
import Mensaje from '../components/Mensaje';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

const MaterialesList = () => {
  const { selectedLocal } = useAuth();
  
  const localesMap = {
    'L-01': 'Jumbo Costanera Center',
    'L-02': 'Jumbo Alto Las Condes',
    'L-03': 'Jumbo El Llano'
  };
  const tiendaActiva = localesMap[selectedLocal] || '';
  
  // 1. Estados principales (RF-05, RNF-04)
  const [materiales, setMateriales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMateriales, setFilteredMateriales] = useState([]);
  const [hoveredZoneId, setHoveredZoneId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // 2. Cargar zonas desde la API cuando cambia el local seleccionado
  useEffect(() => {
    setLoading(true);
    const localStoredZones = localStorage.getItem(`jumbo_heatmap_zonas_${selectedLocal}`);
    
    fetch(`http://localhost:3001/api/zonas/${selectedLocal}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMateriales(data);
          setFilteredMateriales(data);
          localStorage.setItem(`jumbo_heatmap_zonas_${selectedLocal}`, JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Servidor backend offline. Cargando base de datos local offline:', err);
        if (localStoredZones) {
          const parsed = JSON.parse(localStoredZones);
          setMateriales(parsed);
          setFilteredMateriales(parsed);
        } else {
          const defaultZones = FALLBACK_ZONAS[selectedLocal] || [];
          setMateriales(defaultZones);
          setFilteredMateriales(defaultZones);
          localStorage.setItem(`jumbo_heatmap_zonas_${selectedLocal}`, JSON.stringify(defaultZones));
        }
        setLoading(false);
      });
  }, [selectedLocal]);

  // 3. useEffect para filtrado reactivo de la lista de zonas (Hook Obligatorio 4.2)
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
    document.title = `Jumbo Cencosud - Mapa de Calor`;
  }, []);

  // 4. Manejo de inputs del formulario
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

  // 5. Validación visual y lógica de guardado (RF-02, RF-03)
  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre del departamento es obligatorio.';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMensaje({
        tipo: 'error',
        texto: 'Por favor, corrija los campos marcados en rojo antes de enviar.'
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/zonas/${selectedLocal}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar la zona');
      }

      // Volver a cargar la lista de zonas desde el servidor para sincronizar
      const res = await fetch(`http://localhost:3001/api/zonas/${selectedLocal}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setMateriales(data);
        localStorage.setItem(`jumbo_heatmap_zonas_${selectedLocal}`, JSON.stringify(data));
      }

      setMensaje({
        tipo: 'exito',
        texto: isEditing 
          ? `¡Zona ${formData.nombre} actualizada correctamente!`
          : `¡Zona ${formData.nombre} registrada correctamente en el sistema!`
      });

      handleReset();
    } catch (error) {
      console.warn('Conexión con backend fallida. Registrando cambios en base de datos local (Offline)...', error);
      
      const updatedZones = [...materiales];
      const existingZoneIndex = updatedZones.findIndex((z) => z.codigo === formData.codigo);
      
      // Calcular estado y colores en base a afluencia
      const qty = parseInt(formData.cantidad, 10) || 0;
      let computedStatus = 'frio';
      let colorHex = '#38bdf8';
      let colorClass = 'cold';
      
      if (qty >= 140) {
        computedStatus = 'caliente';
        colorHex = '#ef4444';
        colorClass = 'hot';
      } else if (qty >= 70) {
        computedStatus = 'templado';
        colorHex = '#f59e0b';
        colorClass = 'warm';
      }

      const newOrUpdatedZone = {
        ...formData,
        estado: computedStatus,
        colorHex,
        color: colorClass
      };

      if (existingZoneIndex !== -1) {
        updatedZones[existingZoneIndex] = {
          ...updatedZones[existingZoneIndex],
          ...newOrUpdatedZone
        };
      } else {
        updatedZones.push({
          id: formData.codigo,
          cx: "500",
          cy: "300",
          x: "500",
          y: "300",
          xPill: "440",
          yPill: "285",
          aforoMax: 150,
          ...newOrUpdatedZone
        });
      }

      setMateriales(updatedZones);
      localStorage.setItem(`jumbo_heatmap_zonas_${selectedLocal}`, JSON.stringify(updatedZones));

      setMensaje({
        tipo: 'exito',
        texto: isEditing 
          ? `[Modo Local] ¡Zona ${formData.nombre} actualizada correctamente en caché!`
          : `[Modo Local] ¡Zona ${formData.nombre} registrada en caché!`
      });

      handleReset();
    }

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ color: '#008751', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cargando mapa de calor...</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Conectando con el servidor de Cencosud</p>
      </div>
    );
  }

  return (
    <section className="page-zones">
      {/* Barra de Control de Métricas Horizontal (del mockup) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.8rem 1.2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Métrica Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Métrica:</span>
            <select style={{
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#f8fafc',
              cursor: 'pointer'
            }}>
              <option>👥 Concentración de clientes</option>
            </select>
          </div>

          {/* Vista Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Vista:</span>
            <select style={{
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0f172a',
              backgroundColor: '#f8fafc',
              cursor: 'pointer'
            }}>
              <option>🗺️ Mapa de calor</option>
            </select>
          </div>

          {/* Intensidad Scale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Intensidad:</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Baja</span>
            <div style={{
              width: '120px',
              height: '8px',
              borderRadius: '4px',
              background: 'linear-gradient(to right, #38bdf8, #10b981, #f59e0b, #ef4444)'
            }}></div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Alta</span>
          </div>
        </div>

        {/* Datos actualizados status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
          <span style={{ color: '#10b981', fontSize: '1.1rem' }}>●</span>
          <span>Datos actualizados en tiempo real</span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }} title="Recargar datos">🔄</button>
        </div>
      </div>

      {/* Mapa Central - Distribución de Tienda Jumbo (con Zonas Sidebar) */}
      <div className="heatmap-container" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
        
        {/* Header del Mapa Central */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
            Mapa Central – {tiendaActiva || 'Planta Baja (Piso 1)'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', fontWeight: 700 }}>
            <span className="pulse-dot" style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block'
            }}></span>
            <span>Datos Sensores Activos | Carga: 100%</span>
          </div>
        </div>

        <div className="heatmap-wrapper">
          
          {/* 1. PLANO DEL SUPERMERCADO */}
          <div className="heatmap-plan" aria-label="Plano interactivo de la distribución de pasillos y flujo de clientes en Jumbo">
            
            {/* SVG Floor Plan Background */}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 800 500" 
              preserveAspectRatio="none"
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, pointerEvents: 'none' }}
            >
              <defs>
                <pattern id="blueprint-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                  <path d="M 125 0 L 0 0 0 125" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
              <rect x="15" y="15" width="770" height="470" rx="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <rect x="18" y="18" width="764" height="464" rx="8" fill="none" stroke="#cbd5e1" strokeWidth="1" />

              {/* ENTRADA / SALIDA AREA */}
              <g opacity="0.8">
                <path d="M 15 250 L 100 250" stroke="#94a3b8" strokeWidth="2.5" />
                <path d="M 15 350 L 100 350" stroke="#94a3b8" strokeWidth="2.5" />
                <rect x="15" y="250" width="75" height="100" fill="#eff6ff" opacity="0.6" />
                <line x1="85" y1="260" x2="85" y2="340" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M 35 285 L 65 285 M 55 275 L 65 285 L 55 295" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M 65 315 L 35 315 M 45 305 L 35 315 L 45 325" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <text x="30" y="340" fontSize="8" fontWeight="bold" fill="#3b82f6">ACCESO</text>
              </g>

              {/* FRUTAS Y VERDURAS */}
              <g opacity="0.8">
                <rect x="200" y="80" width="70" height="40" rx="8" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
                <rect x="290" y="80" width="70" height="40" rx="8" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
                <rect x="200" y="140" width="70" height="40" rx="8" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
                <rect x="290" y="140" width="70" height="40" rx="8" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.5" />
                <circle cx="220" cy="100" r="6" fill="#ef4444" />
                <circle cx="250" cy="100" r="6" fill="#eab308" />
                <circle cx="310" cy="100" r="6" fill="#16a34a" />
                <circle cx="340" cy="100" r="6" fill="#f97316" />
                <circle cx="220" cy="160" r="6" fill="#16a34a" />
                <circle cx="250" cy="160" r="6" fill="#dc2626" />
                <circle cx="310" cy="160" r="6" fill="#eab308" />
                <circle cx="340" cy="160" r="6" fill="#16a34a" />
                <text x="235" y="65" fontSize="9" fontWeight="bold" fill="#16a34a">FRUTAS & VERDURAS</text>
              </g>

              {/* CARNICERÍA */}
              <g opacity="0.8">
                <rect x="480" y="50" width="160" height="25" rx="3" fill="#fee2e2" stroke="#fca5a5" strokeWidth="1.5" />
                <rect x="480" y="105" width="70" height="30" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <rect x="570" y="105" width="70" height="30" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="490" y1="62" x2="630" y2="62" stroke="#ef4444" strokeWidth="1.5" />
                <text x="525" y="40" fontSize="9" fontWeight="bold" fill="#dc2626">CARNES & AVES</text>
              </g>

              {/* ABARROTES */}
              <g opacity="0.8">
                <rect x="300" y="210" width="180" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="300" y="250" width="180" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="300" y="290" width="180" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <rect x="300" y="330" width="180" height="20" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="390" y1="210" x2="390" y2="230" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="390" y1="250" x2="390" y2="270" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="390" y1="290" x2="390" y2="310" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="390" y1="330" x2="390" y2="350" stroke="#cbd5e1" strokeWidth="1" />
                <text x="365" y="198" fontSize="9" fontWeight="bold" fill="#475569">PASILLOS ABARROTES</text>
              </g>

              {/* LÁCTEOS */}
              <g opacity="0.8">
                <rect x="680" y="160" width="25" height="190" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                <rect x="610" y="220" width="50" height="35" rx="3" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
                <line x1="692" y1="170" x2="692" y2="340" stroke="#0284c7" strokeWidth="2" strokeDasharray="10 5" />
                <text x="615" y="150" fontSize="9" fontWeight="bold" fill="#0284c7">LÁCTEOS & QUESOS</text>
              </g>

              {/* PANADERÍA */}
              <g opacity="0.8">
                <rect x="200" y="390" width="100" height="35" rx="4" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                <rect x="200" y="435" width="60" height="25" rx="3" fill="#fffbeb" stroke="#fde68a" strokeWidth="1" />
                <text x="215" y="380" fontSize="9" fontWeight="bold" fill="#ea580c">PANADERÍA</text>
              </g>

              {/* CAJAS / CHECKOUT */}
              <g opacity="0.8">
                <g transform="translate(350, 390)">
                  <rect x="0" y="0" width="12" height="45" rx="2" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.2" />
                  <rect x="15" y="0" width="8" height="8" rx="1" fill="#a855f7" />
                  <line x1="6" y1="10" x2="6" y2="40" stroke="#c084fc" strokeWidth="1" />
                </g>
                <g transform="translate(385, 390)">
                  <rect x="0" y="0" width="12" height="45" rx="2" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.2" />
                  <rect x="15" y="0" width="8" height="8" rx="1" fill="#a855f7" />
                  <line x1="6" y1="10" x2="6" y2="40" stroke="#c084fc" strokeWidth="1" />
                </g>
                <g transform="translate(420, 390)">
                  <rect x="0" y="0" width="12" height="45" rx="2" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.2" />
                  <rect x="15" y="0" width="8" height="8" rx="1" fill="#a855f7" />
                  <line x1="6" y1="10" x2="6" y2="40" stroke="#c084fc" strokeWidth="1" />
                </g>
                <g transform="translate(455, 390)">
                  <rect x="0" y="0" width="12" height="45" rx="2" fill="#faf5ff" stroke="#a855f7" strokeWidth="1.2" />
                  <rect x="15" y="0" width="8" height="8" rx="1" fill="#a855f7" />
                  <line x1="6" y1="10" x2="6" y2="40" stroke="#c084fc" strokeWidth="1" />
                </g>
                <text x="390" y="380" fontSize="9" fontWeight="bold" fill="#7e22ce">CAJAS</text>
              </g>

              {/* BEBIDAS */}
              <g opacity="0.8">
                <rect x="510" y="390" width="100" height="30" rx="3" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
                <rect x="520" y="430" width="80" height="25" rx="3" fill="#f0fdfa" stroke="#5eead4" strokeWidth="1.2" />
                <text x="535" y="380" fontSize="9" fontWeight="bold" fill="#0f766e">BEBIDAS & LIQUIDOS</text>
              </g>

            </svg>

            {/* Renderizar dinámicamente los hotspots de calor */}
            {materiales.map((m) => {
              const isHovered = hoveredZoneId === m.id;
              const connectorHeight = 35;
              
              return (
                <React.Fragment key={m.id}>
                  <div 
                    className={`hotspot-circle ${m.estado}`}
                    style={{
                      left: m.x,
                      top: m.y,
                      transform: `translate(-50%, -50%) scale(${isHovered ? 1.2 : 1})`
                    }}
                  ></div>

                  <div 
                    className="hotspot-center-dot"
                    style={{
                      left: m.x,
                      top: m.y,
                      backgroundColor: m.colorHex
                    }}
                  ></div>

                  <div 
                    className="hotspot-connector"
                    style={{
                      left: m.x,
                      top: `calc(${m.y} - ${connectorHeight}px)`,
                      height: `${connectorHeight}px`,
                      borderColor: m.colorHex,
                      opacity: isHovered ? 1 : 0.6
                    }}
                  ></div>

                  <div 
                    className={`hotspot-pill ${isHovered ? 'active-pill' : ''}`}
                    style={{
                      left: m.x,
                      top: `calc(${m.y} - ${connectorHeight}px)`,
                      borderColor: m.colorHex
                    }}
                    onMouseEnter={() => setHoveredZoneId(m.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onClick={() => handleEditClick(m)}
                  >
                    <span className="pill-dot" style={{ backgroundColor: m.colorHex }}></span>
                    <span className="pill-text">{m.nombre}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* 2. PANEL LATERAL DE ZONAS */}
          <div className="heatmap-sidebar">
            <div>
              <h3 className="sidebar-title">Zonas</h3>
              <ul className="zones-list">
                {materiales.map((m) => (
                  <li 
                    key={m.id} 
                    className={`zone-item ${hoveredZoneId === m.id ? 'active-item' : ''}`}
                    onMouseEnter={() => setHoveredZoneId(m.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onClick={() => handleEditClick(m)}
                  >
                    <span className={`dot ${m.color}`} style={{ backgroundColor: m.colorHex }}></span>
                    <span>{m.nombre}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="sidebar-footer">
              Pasa el cursor sobre una zona para ver más información y su ubicación exacta.
            </div>
          </div>

        </div>

        {/* Leyenda de Colores */}
        <div className="heatmap-legend">
          <div className="legend-item">
            <span className="dot hot"></span>
            <span>Tránsito Alto / Zona Caliente (&gt;140 pers/h)</span>
          </div>
          <div className="legend-item">
            <span className="dot warm"></span>
            <span>Tránsito Medio / Zona Templada (70-140 pers/h)</span>
          </div>
          <div className="legend-item">
            <span className="dot cold"></span>
            <span>Tránsito Bajo / Zona Fría (&lt;70 pers/h)</span>
          </div>
        </div>
      </div>

      {/* 3. BARRA DE MÉTRICAS GENERALES EN FOOTER INTERNO */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem 1.2rem',
        marginBottom: '2.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRight: '1px solid #f1f5f9', paddingRight: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '50%' }}>👥</span>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Visitantes totales</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>28,450</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 12.5% vs. semana anterior</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRight: '1px solid #f1f5f9', paddingRight: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', backgroundColor: '#fff8e1', padding: '8px', borderRadius: '50%' }}>🕒</span>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Tiempo promedio en tienda</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>36:45 min</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>↑ 8.3% vs. semana anterior</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', borderRight: '1px solid #f1f5f9', paddingRight: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', backgroundColor: '#ffebee', padding: '8px', borderRadius: '50%' }}>📈</span>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Zona con más tráfico</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Entrada / Salida</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>24.6% del tráfico total</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <span style={{ fontSize: '1.5rem', backgroundColor: '#e0f2fe', padding: '8px', borderRadius: '50%' }}>📉</span>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Zona con menos tráfico</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Lácteos</div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>+4.3% del tráfico total</div>
          </div>
        </div>
      </div>

      {/* 4. BUSCADOR Y LISTADO DE TARJETAS */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
        Registro e Inventario de Zonas
      </h3>
      
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
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

      {/* Listado de Tarjetas Reutilizables */}
      <div className="zones-flex-container" style={{ marginBottom: '3rem' }}>
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
            <p style={{ fontWeight: 600 }}>No se encontraron departamentos que coincidan.</p>
          </div>
        )}
      </div>

      {/* Mensaje de confirmación del formulario */}
      <Mensaje tipo={mensaje.tipo} texto={mensaje.texto} />

      {/* 5. FORMULARIO DE ADMINISTRACIÓN */}
      <div className="admin-panel" id="admin-form">
        
        {/* Formulario */}
        <div className="form-container">
          <h3>{isEditing ? '⚙️ Actualizar Datos de Zona' : '➕ Registrar Nueva Zona en Plano'}</h3>
          
          <form onSubmit={handleSubmit} noValidate>
            
            <div className={`form-group ${formErrors.nombre ? 'invalid' : ''}`}>
              <label htmlFor="nombre-input">Nombre del Departamento</label>
              <input
                id="nombre-input"
                type="text"
                name="nombre"
                placeholder="Ej. Bebidas, Abarrotes, Panadería..."
                value={formData.nombre}
                onChange={handleInputChange}
                aria-invalid={formErrors.nombre ? "true" : "false"}
                aria-describedby={formErrors.nombre ? "nombre-error" : undefined}
              />
              {formErrors.nombre && (
                <span id="nombre-error" className="error-msg">{formErrors.nombre}</span>
              )}
            </div>

            <div className={`form-group ${formErrors.codigo ? 'invalid' : ''}`}>
              <label htmlFor="codigo-input">Código de Zona (Prefijo Z-XX)</label>
              <input
                id="codigo-input"
                type="text"
                name="codigo"
                placeholder="Ej. Z-09"
                value={formData.codigo}
                onChange={handleInputChange}
                disabled={isEditing}
                aria-invalid={formErrors.codigo ? "true" : "false"}
                aria-describedby={formErrors.codigo ? "codigo-error" : undefined}
              />
              {formErrors.codigo && (
                <span id="codigo-error" className="error-msg">{formErrors.codigo}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="estado-select">Nivel de Tráfico (Intensidad)</label>
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

            <div className={`form-group ${formErrors.imagen ? 'invalid' : ''}`}>
              <label htmlFor="imagen-input">URL de la Imagen del Departamento</label>
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

        {/* Guía Administrativa */}
        <div className="admin-info">
          <h3>Optimización de Distribución</h3>
          <p>
            Al registrar una zona o editar su afluencia, los hotspots interactivos del plano superior 
            se re-calcularán de manera reactiva e instantánea usando la tecnología del estado local de React.
          </p>
          <ul className="rules-list">
            <li><strong>Zonas Calientes (&gt;140 pers/h)</strong>: Indicadas en color rojo brillante. Concentran las compras impulsivas.</li>
            <li><strong>Zonas Templadas (70-140 pers/h)</strong>: Indicadas en color naranja/amarillo. Tráfico constante de abastecimiento.</li>
            <li><strong>Zonas Frías (&lt;70 pers/h)</strong>: Indicadas en color azul/celeste. Pasillos de bajo impacto que requieren optimización del surtido.</li>
          </ul>
        </div>

      </div>
    </section>
  );
};

export default MaterialesList;