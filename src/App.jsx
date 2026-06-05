import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Páginas
import Homepage from './pages/Homepage';
import MaterialesList from './pages/MaterialesList';
import MaterialDetail from './pages/MaterialDetail';
import Contacto from './pages/Contacto';

// Estilos globales integrados (SASS index.scss)
import './index.scss';

function App() {
  // 1. Crear el estado de la tienda seleccionada
  const [tiendaActiva, setTiendaActiva] = useState('Jumbo Costanera Center');

  return (
    <Router>
      <div className="app-container">
        <Header />
        
        {/* 2. Pasar el estado y la función para actualizarlo al Sidebar */}
        <Sidebar tiendaActiva={tiendaActiva} setTiendaActiva={setTiendaActiva} />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/materiales" element={<MaterialesList tiendaActiva={tiendaActiva} />} />
            <Route path="/trafico" element={<Homepage />} />
            <Route path="/zonas" element={<MaterialesList />} />
            <Route path="/reportes" element={<Homepage />} />
            <Route path="/alertas" element={<Homepage />} />
            <Route path="/comparaciones" element={<MaterialesList />} />
            <Route path="/configuracion" element={<Homepage />} />
            <Route path="/materiales/:id" element={<MaterialDetail />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h2>❌ Página No Encontrada (Error 404)</h2>
                <p style={{ margin: '1rem 0', color: '#64748b' }}>La dirección a la que intenta acceder no existe.</p>
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
