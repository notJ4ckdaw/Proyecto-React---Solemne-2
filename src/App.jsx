import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Páginas
import Homepage from './pages/Homepage';
import MaterialesList from './pages/MaterialesList';
import MaterialDetail from './pages/MaterialDetail';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Trafico from './pages/Trafico';
import Reportes from './pages/Reportes';
import Alertas from './pages/Alertas';
import Configuracion from './pages/Configuracion';

// Contexto
import { AuthProvider, useAuth } from './context/AuthContext';

// Estilos globales
import './index.scss';

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#ffffff' }}>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cargando sesión...</h3>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Componente de Layout protegido
const AppLayout = () => {
  return (
    <ProtectedRoute>
      <div className="app-container">
        <Header />
        
        <Sidebar />
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/materiales" element={<MaterialesList />} />
            <Route path="/trafico" element={<Trafico />} />
            <Route path="/zonas" element={<MaterialesList />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/comparaciones" element={<MaterialesList />} />
            <Route path="/configuracion" element={<Configuracion />} />
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
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas privadas bajo el layout */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
