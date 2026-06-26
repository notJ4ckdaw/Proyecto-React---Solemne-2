import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FALLBACK_ZONAS } from '../data/fallbackData';

const Comparaciones = () => {
  const { selectedLocal, selectedFloor } = useAuth();
  
  // Nombres de locales para visualización
  const localesMap = {
    'L-01': 'Jumbo Costanera Center',
    'L-02': 'Jumbo Alto Las Condes',
    'L-03': 'Jumbo El Llano'
  };

  // Nombres de zonas dinámicos por piso
  const getZonasMap = () => {
    if (selectedFloor === '2') {
      return {
        'Z-01': 'Acceso Escaleras Mecánicas',
        'Z-02': 'Electrohogar y Línea Blanca',
        'Z-03': 'Computación y Telefonía',
        'Z-04': 'Vestuario Infantil',
        'Z-05': 'Vestuario Adultos y Calzado',
        'Z-06': 'Juguetería y Rodados',
        'Z-07': 'Librería y Artículos de Oficina',
        'Z-08': 'Cajas Piso 2'
      };
    }
    if (selectedFloor === '3') {
      return {
        'Z-01': 'Terraza, Jardín y Aire Libre',
        'Z-02': 'Muebles y Decoración',
        'Z-03': 'Menaje Cocina y Mesa',
        'Z-04': 'Dormitorio y Blancos',
        'Z-05': 'Baño y Organización',
        'Z-06': 'Deportes y Automotriz',
        'Z-07': 'Ferretería y Herramientas',
        'Z-08': 'Cajas Piso 3'
      };
    }
    // Por defecto Piso 1 (Planta Baja)
    return {
      'Z-01': 'Entrada y Salida Principal',
      'Z-02': 'Frutas y Verduras',
      'Z-03': 'Fiambrería y Carnicería',
      'Z-04': 'Lácteos y Quesos',
      'Z-05': 'Panadería y Pastelería',
      'Z-06': 'Góndola Central (Abarrotes)',
      'Z-07': 'Licores y Bebidas',
      'Z-08': 'Línea de Cajas Rápidas'
    };
  };

  const zonasMap = getZonasMap();

  // 1. Estados de Filtros
  const [selectedZone, setSelectedZone] = useState('Z-01');
  const [viewPeriod, setViewPeriod] = useState('semanal'); // 'semanal' o 'mensual'
  const [selectedDate, setSelectedDate] = useState('2026-06-25');
  const [selectedHour, setSelectedHour] = useState(18); // Hora por defecto: 18:00
  
  // Estado para interactividad del gráfico (punto seleccionado)
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Cambiar el título del documento
  useEffect(() => {
    document.title = 'Jumbo Cencosud - Comparador Histórico';
  }, []);

  // 2. Simulador determinista de datos históricos
  // Genera datos basados en los filtros de forma coherente para que las comparaciones sean realistas.
  const generateSimulatedData = () => {
    // Semilla basada en los nombres de zona, local y piso para consistencia
    const zoneSeed = selectedZone.charCodeAt(1) || 1;
    const localSeed = selectedLocal.charCodeAt(1) || 1;
    const floorSeed = parseInt(selectedFloor) || 1;
    const dateSeed = new Date(selectedDate).getDate() || 1;
    
    // Curva del día de la semana (Lunes a Domingo)
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const datosSemanales = diasSemana.map((dia, index) => {
      // Fines de semana tienen más flujo
      const finDeSemanaFactor = (index === 5 || index === 6) ? 1.4 : 1.0;
      
      // Variación según zona
      let baseFlow = 70;
      if (selectedZone === 'Z-01' || selectedZone === 'Z-08') baseFlow = 130; // Entrada y Cajas son de alto tráfico
      if (selectedZone === 'Z-04' || selectedZone === 'Z-07') baseFlow = 45;  // Zonas de menor tránsito relativo
      
      // Ajuste de flujo según el piso (por ejemplo, Piso 1 es el más concurrido, luego Piso 2 y 3)
      const floorFactor = floorSeed === 1 ? 1.0 : floorSeed === 2 ? 0.8 : 0.65;
      
      // Cálculo pseudo-aleatorio pero determinista
      const dayOffset = Math.sin(index + zoneSeed + localSeed + dateSeed + floorSeed) * 20;
      const finalFlow = Math.round(((baseFlow + dayOffset) * finDeSemanaFactor) * floorFactor);
      
      // Limitar flujo entre 10 y 200 pers/h
      return {
        label: dia,
        valor: Math.max(10, Math.min(200, finalFlow))
      };
    });

    // Curva del mes (Semanas 1 a 4)
    const datosMensuales = [
      { label: 'Semana 1', valor: Math.round(datosSemanales[2].valor * 0.95) },
      { label: 'Semana 2', valor: Math.round(datosSemanales[4].valor * 1.05) },
      { label: 'Semana 3', valor: Math.round(datosSemanales[5].valor * 0.90) },
      { label: 'Semana 4', valor: Math.round(datosSemanales[5].valor * 1.15) } // Fin de mes hay más flujo
    ];

    // Curva por hora para el día seleccionado (08:00 a 22:00)
    const datosHoras = [];
    for (let h = 8; h <= 22; h++) {
      let timeFactor = 1.0;
      // Horas pico típicas: Almuerzo (12:00 - 14:00) y Tarde (18:00 - 20:00)
      if ((h >= 12 && h <= 14) || (h >= 18 && h <= 20)) {
        timeFactor = 1.5;
      } else if (h >= 8 && h <= 10) {
        timeFactor = 0.5; // Temprano en la mañana
      }
      
      let baseFlow = 65;
      if (selectedZone === 'Z-01' || selectedZone === 'Z-08') baseFlow = 110;
      if (selectedZone === 'Z-04' || selectedZone === 'Z-07') baseFlow = 40;
      
      const floorFactor = floorSeed === 1 ? 1.0 : floorSeed === 2 ? 0.8 : 0.65;
      const hourOffset = Math.cos(h + zoneSeed + localSeed + floorSeed) * 15;
      const finalFlow = Math.round(((baseFlow + hourOffset) * timeFactor) * floorFactor);
      
      datosHoras.push({
        hora: `${h.toString().padStart(2, '0')}:00`,
        valor: Math.max(8, Math.min(200, finalFlow))
      });
    }

    return { datosSemanales, datosMensuales, datosHoras };
  };

  const { datosSemanales, datosMensuales, datosHoras } = generateSimulatedData();

  // 3. Cálculos de Estadísticas
  const getStats = () => {
    const list = viewPeriod === 'semanal' ? datosSemanales : datosMensuales;
    const valores = list.map(d => d.valor);
    const maxVal = Math.max(...valores, 1);
    const minVal = Math.min(...valores);
    const promedio = Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
    const peakIndex = valores.indexOf(maxVal);
    const peakLabel = list[peakIndex]?.label || '';
    
    return { maxVal, minVal, promedio, peakLabel };
  };

  const stats = getStats();

  // Helper para asignar color según flujo
  const getTrafficColor = (value) => {
    if (value >= 140) return '#EF4444'; // Caliente / Rojo
    if (value >= 80) return '#F59E0B';  // Templado / Naranja
    return '#3B82F6';                   // Frío / Azul
  };

  // Dimensiones del SVG del gráfico
  const width = 650;
  const height = 280;
  const padding = 45;

  return (
    <section className="page-comparaciones" style={{ padding: '1.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Banner Superior */}
      <div style={{
        background: 'linear-gradient(135deg, #00875A 0%, #006644 100%)',
        color: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem 2rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 15px rgba(0, 135, 90, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Módulo Analítico VCM
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.35rem' }}>
            Comparador de Tránsito Histórico
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', maxWidth: '750px' }}>
            Visualiza y contrasta el tránsito de personas en las distintas áreas comerciales del supermercado.
            Compara por horas específicas, días de la semana y bloques del mes para detectar cuellos de botella y ajustar dotación.
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1
        }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1.5rem' }}>
        
        {/* PANEL DE FILTROS (Lateral Izquierdo) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
          border: '1px solid #f1f5f9',
          height: 'fit-content'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', borderBottom: '2px solid #00875A', paddingBottom: '0.5rem' }}>
            Filtros de Análisis
          </h2>

          {/* Local Activo */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Sucursal Seleccionada
            </label>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#334155'
            }}>
              🏢 {localesMap[selectedLocal] || 'Cargando sucursal...'}
            </div>
          </div>

          {/* Piso Monitoreado */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Piso Monitoreado
            </label>
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#334155'
            }}>
              🟢 Piso {selectedFloor === '1' ? '1 (Planta Baja)' : selectedFloor === '2' ? '2 (Tecnología y Ropa)' : '3 (Hogar y Deportes)'}
            </div>
          </div>

          {/* Zona / Sector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Sector Comercial / Zona
            </label>
            <select 
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                color: '#334155',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {Object.entries(zonasMap).map(([codigo, nombre]) => (
                <option key={codigo} value={codigo}>
                  [{codigo}] {nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Período */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Rango Comparativo
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              <button
                onClick={() => setViewPeriod('semanal')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: viewPeriod === 'semanal' ? '#ffffff' : 'transparent',
                  color: viewPeriod === 'semanal' ? '#00875A' : '#64748b',
                  boxShadow: viewPeriod === 'semanal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Semanal
              </button>
              <button
                onClick={() => setViewPeriod('mensual')}
                style={{
                  flex: 1,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: viewPeriod === 'mensual' ? '#ffffff' : 'transparent',
                  color: viewPeriod === 'mensual' ? '#00875A' : '#64748b',
                  boxShadow: viewPeriod === 'mensual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                Mensual
              </button>
            </div>
          </div>

          {/* Fecha */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Fecha Base de Comparación
            </label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                color: '#334155',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Selector de Hora Deslizable */}
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <span>Hora Activa</span>
              <span style={{ color: '#00875A', fontWeight: 'bold' }}>{selectedHour.toString().padStart(2, '0')}:00 hrs</span>
            </label>
            <input 
              type="range"
              min="8"
              max="22"
              value={selectedHour}
              onChange={(e) => setSelectedHour(parseInt(e.target.value))}
              style={{
                width: '100%',
                cursor: 'pointer',
                accentColor: '#00875A'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
              <span>08:00</span>
              <span>15:00</span>
              <span>22:00</span>
            </div>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DE GRÁFICOS (Derecho) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tarjeta de Gráfico Histórico */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            border: '1px solid #f1f5f9'
          }}>
            
            {/* Cabecera del Gráfico */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Afluencia de Clientes - Vista {viewPeriod === 'semanal' ? 'Semanal' : 'Mensual'}
                </h3>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Análisis para el sector <strong>[{selectedZone}] {zonasMap[selectedZone]}</strong>
                </p>
              </div>
              <div style={{
                background: '#e6f4ea',
                color: '#137333',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '12px',
                fontWeight: 600
              }}>
                Datos Estables
              </div>
            </div>

            {/* GRÁFICO SVG PERSONALIZADO INTERACTIVO */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              {viewPeriod === 'semanal' ? (
                // 📈 GRÁFICO DE ÁREA SEMANAL (SVG)
                <svg width={width} height={height} style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00875A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00875A" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Líneas de cuadrícula horizontal */}
                  {[0, 50, 100, 150, 200].map((gridVal, i) => {
                    const y = height - padding - (gridVal / 200) * (height - 2 * padding);
                    return (
                      <g key={i}>
                        <line 
                          x1={padding} 
                          y1={y} 
                          x2={width - padding} 
                          y2={y} 
                          stroke="#e2e8f0" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={padding - 10} 
                          y={y + 4} 
                          textAnchor="end" 
                          fontSize="10px" 
                          fill="#94a3b8"
                        >
                          {gridVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Generar puntos de la curva */}
                  {(() => {
                    const pointsCount = datosSemanales.length;
                    const stepX = (width - 2 * padding) / (pointsCount - 1);
                    const coords = datosSemanales.map((d, index) => {
                      const x = padding + index * stepX;
                      const y = height - padding - (d.valor / 200) * (height - 2 * padding);
                      return { x, y, label: d.label, valor: d.valor };
                    });

                    // Construcción del path de la línea
                    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
                    // Path del área rellena debajo de la curva
                    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

                    return (
                      <g>
                        {/* Área degradada */}
                        <path d={areaPath} fill="url(#areaGradient)" />
                        
                        {/* Línea principal */}
                        <path d={linePath} fill="none" stroke="#00875A" strokeWidth="3" />

                        {/* Puntos / Marcadores interactivos */}
                        {coords.map((c, i) => (
                          <g key={i}>
                            {/* Círculo invisible para expandir zona de hover */}
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r="15"
                              fill="transparent"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setHoveredPoint({ x: c.x, y: c.y, label: c.label, valor: c.valor })}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                            {/* Círculo visible en la curva */}
                            <circle 
                              cx={c.x} 
                              cy={c.y} 
                              r={hoveredPoint?.label === c.label ? "7" : "5"} 
                              fill={hoveredPoint?.label === c.label ? "#00875A" : "#ffffff"} 
                              stroke="#00875A" 
                              strokeWidth="3" 
                              transition="all 0.1s"
                            />
                            {/* Etiquetas del eje X */}
                            <text
                              x={c.x}
                              y={height - padding + 18}
                              textAnchor="middle"
                              fontSize="10px"
                              fontWeight="600"
                              fill="#64748b"
                            >
                              {c.label.substring(0, 3)}
                            </text>
                          </g>
                        ))}
                      </g>
                    );
                  })()}

                  {/* Borde / Línea base del eje X */}
                  <line 
                    x1={padding} 
                    y1={height - padding} 
                    x2={width - padding} 
                    y2={height - padding} 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                  />
                </svg>
              ) : (
                // 📊 GRÁFICO DE BARRAS MENSUAL (SVG)
                <svg width={width} height={height} style={{ overflow: 'visible' }}>
                  {/* Líneas de cuadrícula horizontal */}
                  {[0, 50, 100, 150, 200].map((gridVal, i) => {
                    const y = height - padding - (gridVal / 200) * (height - 2 * padding);
                    return (
                      <g key={i}>
                        <line 
                          x1={padding} 
                          y1={y} 
                          x2={width - padding} 
                          y2={y} 
                          stroke="#e2e8f0" 
                          strokeDasharray="4 4" 
                        />
                        <text 
                          x={padding - 10} 
                          y={y + 4} 
                          textAnchor="end" 
                          fontSize="10px" 
                          fill="#94a3b8"
                        >
                          {gridVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Renderizar Barras del Mes */}
                  {(() => {
                    const barWidth = 60;
                    const spacing = (width - 2 * padding - barWidth * datosMensuales.length) / (datosMensuales.length + 1);
                    return datosMensuales.map((d, index) => {
                      const x = padding + spacing + index * (barWidth + spacing);
                      const barHeight = (d.valor / 200) * (height - 2 * padding);
                      const y = height - padding - barHeight;
                      
                      const isHovered = hoveredPoint?.label === d.label;

                      return (
                        <g key={index}>
                          {/* Barra de Fondo Completa (Invisible para Hover completo) */}
                          <rect
                            x={x - 10}
                            y={padding}
                            width={barWidth + 20}
                            height={height - 2 * padding}
                            fill="transparent"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredPoint({ x: x + barWidth / 2, y, label: d.label, valor: d.valor })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          {/* Barra visible */}
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="6"
                            fill={isHovered ? '#006644' : '#00875A'}
                            style={{ transition: 'all 0.2s ease' }}
                          />
                          {/* Valor de texto encima de la barra si hay hover o fijo */}
                          <text
                            x={x + barWidth / 2}
                            y={y - 8}
                            textAnchor="middle"
                            fontSize="11px"
                            fontWeight="bold"
                            fill="#0f172a"
                            opacity={isHovered ? 1 : 0.8}
                          >
                            {d.valor} p/h
                          </text>
                          {/* Etiquetas del eje X */}
                          <text
                            x={x + barWidth / 2}
                            y={height - padding + 18}
                            textAnchor="middle"
                            fontSize="10px"
                            fontWeight="600"
                            fill="#64748b"
                          >
                            {d.label}
                          </text>
                        </g>
                      );
                    });
                  })()}

                  {/* Borde / Línea base del eje X */}
                  <line 
                    x1={padding} 
                    y1={height - padding} 
                    x2={width - padding} 
                    y2={height - padding} 
                    stroke="#94a3b8" 
                    strokeWidth="1.5" 
                  />
                </svg>
              )}

              {/* TOOLTIP EMERGENTE FLOTANTE */}
              {hoveredPoint && (
                <div style={{
                  position: 'absolute',
                  left: `${hoveredPoint.x}px`,
                  top: `${hoveredPoint.y - 65}px`,
                  transform: 'translateX(-50%)',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '100px'
                }}>
                  <span style={{ opacity: 0.8, fontSize: '0.65rem' }}>{hoveredPoint.label}</span>
                  <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#10b981', marginTop: '2px' }}>
                    {hoveredPoint.valor} pers/h
                  </span>
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%) rotate(45deg)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#0f172a'
                  }} />
                </div>
              )}
            </div>
          </div>

          {/* Tarjetas de Estadísticas Comparativas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tránsito Promedio</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.promedio} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#64748b' }}>p/h</span></div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>📈 Estable en la última jornada</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Punto Máximo / Pico</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>{stats.maxVal} <span style={{ fontSize: '0.85rem', fontWeight: 'normal', color: '#64748b' }}>p/h</span></div>
              <div style={{ fontSize: '0.7rem', color: '#0f172a', fontWeight: 'bold' }}>⭐ {stats.peakLabel}</div>
            </div>

            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #f1f5f9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Estado de Saturación</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: getTrafficColor(stats.promedio), margin: '6px 0', textTransform: 'uppercase' }}>
                {stats.promedio >= 140 ? 'Caliente 🔥' : stats.promedio >= 80 ? 'Templado ⚡' : 'Frío ❄️'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Límite crítico: 140 personas/hora</div>
            </div>
          </div>

          {/* MAPA DE CALOR DETALLADO POR HORA DEL DÍA */}
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 1rem 0' }}>
              Distribución Horaria del Tránsito (Fecha: {selectedDate})
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '-0.5rem 0 1.25rem 0' }}>
              Haz clic o arrastra el control deslizante lateral para ver cómo fluctúa el volumen de personas hora tras hora.
            </p>

            {/* Fila de cápsulas horarias */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              scrollbarWidth: 'thin'
            }}>
              {datosHoras.map((dh, index) => {
                const hourNum = parseInt(dh.hora.split(':')[0]);
                const isActive = hourNum === selectedHour;
                const statusColor = getTrafficColor(dh.valor);
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedHour(hourNum)}
                    style={{
                      flex: '1 0 65px',
                      padding: '10px 5px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: isActive ? `2px solid #00875A` : '1px solid #e2e8f0',
                      backgroundColor: isActive ? '#f0fdf4' : '#ffffff',
                      boxShadow: isActive ? '0 4px 6px rgba(0,135,90,0.1)' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{dh.hora}</span>
                    <div style={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: statusColor,
                      width: '60%',
                      margin: '2px auto'
                    }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0f172a' }}>{dh.valor}</span>
                    <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>p/h</span>
                  </div>
                );
              })}
            </div>
            
            {/* Análisis y Recomendaciones del Asistente en base al estado de la hora seleccionada */}
            <div style={{
              marginTop: '1.25rem',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #00875A',
              fontSize: '0.85rem',
              color: '#334155'
            }}>
              💡 <strong>Análisis Operativo ({selectedHour}:00 hrs):</strong> El sector comercial <strong>[{selectedZone}]</strong> registra un flujo estimado de <strong>{datosHoras.find(dh => parseInt(dh.hora) === selectedHour)?.valor} personas/hora</strong> a esta hora. 
              {selectedHour >= 18 && selectedHour <= 20 ? (
                <span> Se recomienda mantener activa la dotación completa de personal debido a la alta concentración de público vespertina.</span>
              ) : selectedHour >= 12 && selectedHour <= 14 ? (
                <span> Concentración media alta por horario de almuerzo. Asegurar reposición de productos críticos.</span>
              ) : (
                <span> Flujo holgado y estable. Oportunidad ideal para realizar labores de inventario, aseo o reabastecimiento en góndolas.</span>
              )}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Comparaciones;
