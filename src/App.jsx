import React from 'react';
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
  return (
    <Router>
      <div className="app-container">
        {/* Componentes estructurales de Layout (CSS Grid) */}
        <Header />
        
        <Sidebar />
        
        <main className="app-main">
          {/* Configuración de Rutas de la Aplicación (RF-04) */}
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/materiales" element={<MaterialesList />} />
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
