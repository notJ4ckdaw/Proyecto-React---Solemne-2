# VCM HeatMap - Monitoreo de Tránsito y Distribución del Supermercado

Este proyecto ha sido desarrollado como respuesta técnica para la evaluación **Solemne 2** en la modalidad de frontend funcional, utilizando la escala cromática para el análisis de comportamiento de clientes (Mapa de calor) en supermercados.



 Tecnologías Utilizadas

 **React (v18)** - Biblioteca base para estructurar componentes interactivos y estado dinámico.
 **React Router (v6)** - Sistema de enrutamiento dinámico para navegar sin refrescar la página.
 **SASS / SCSS** - Preprocesador CSS para toda la arquitectura de estilos modulares.
**Vite** - Empaquetador ultra-rápido para el entorno de desarrollo.
**HTML5 Semántico y Accesible (A11y)**.

---

 Mapeo de Requerimientos de la Rúbrica

Para cumplir rigurosamente con las directrices académicas obligatorias de la evaluación, el sistema mapea la estructura de "Materiales" a **Zonas y Departamentos de la tienda**:

1. **Rutas Configuradas (`React Router`)**:
   * `/` - **Homepage**: Resumen estadístico (RF-01) y contexto del proyecto VCM.
   * `/materiales` - **Mapa de Calor e Inventario**: Visualización interactiva del supermercado, listado de zonas y formulario de registro/actualización.
   * `/materiales/:id` - **Detalle de la Zona**: Análisis específico de comportamiento e hipótesis de mejora.
   * `/contacto` - **Soporte Técnico**: Formulario para administradores.

2. **Componentes Obligatorios**:
   * `<MaterialCard />` - Mapeado a **Tarjeta de Zona** con las props obligatorias: `nombre`, `codigo`, `estado` (Temperatura de zona: caliente, templada, fría), `cantidad` (flujo promedio de personas) e `imagen`.
   * `<MenuNav />` - Gestiona la barra lateral con links dinámicos `<Link>` sin refresco de página.
   * `<Mensaje />` - Mapeado para alertas de éxito o error al enviar los formularios.

3. **Hooks Utilizados**:
   * `useState` - Manejo de datos del formulario, estados de zonas y visibilidad/tipo de alertas en pantalla.
   * `useEffect` - Utilizado para la actualización interactiva del título de cada página (`document.title`) y para el filtrado reactivo de la barra de búsqueda en tiempo real.
   * `useParams` - Captura de parámetros de la ruta para renderizar el detalle de la zona seleccionada.

4. **SASS/SCSS & Layouts**:
   * **CSS Grid** en el Layout principal (Header, Sidebar, Main, Footer).
   * **Flexbox** en el listado de tarjetas de zonas y menú de navegación.
   * Estructura modular de partials: `_variables.scss` (colores de contraste y fuentes), `_mixins.scss` (botones y media queries responsive), `_layout.scss`, `_components.scss` y `_pages.scss`.

---

##  Guía de Instalación y Ejecución Local

Para levantar el proyecto en su máquina local, asegúrese de tener **Node.js (versión 16 o superior)** instalado y ejecute:

### 1. Instalar Dependencias
Descarga e instala React, React Router, Vite y el compilador oficial de SASS:
```bash
npm install
```

### 2. Ejecutar Servidor de Desarrollo
Inicia el entorno de pruebas local:
```bash
npm run dev
```

Abra el navegador en la dirección local indicada por la terminal (usualmente `http://localhost:5173`).

### 3. Construir para Producción (Build)
Compila y optimiza el proyecto para distribución real:
```bash
npm run build
```
