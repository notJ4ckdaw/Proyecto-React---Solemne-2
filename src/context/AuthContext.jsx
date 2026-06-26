import React, { createContext, useState, useEffect, useContext } from 'react';
import { FALLBACK_USERS } from '../data/fallbackData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocal, setSelectedLocal] = useState('L-01');

  // Load session from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('jumbo_heatmap_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setSelectedLocal(parsedUser.localAsignado || 'L-01');
    }
    setLoading(false);
  }, []);

  const login = async (usuario, contrasena) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fallo al iniciar sesión');
      }

      setUser(data);
      setSelectedLocal(data.localAsignado || 'L-01');
      localStorage.setItem('jumbo_heatmap_user', JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn('Servidor offline o inaccesible, intentando inicio de sesión local de respaldo:', error);
      
      const cleanUser = usuario ? usuario.trim().toLowerCase() : '';
      const cleanPass = contrasena ? contrasena.trim() : '';

      const matchedUser = FALLBACK_USERS.find(
        (u) => u.usuario.toLowerCase() === cleanUser && u.contrasena === cleanPass
      );

      if (matchedUser) {
        const localSession = {
          ...matchedUser,
          token: `mock-jwt-token-for-${matchedUser.usuario}`,
          isOffline: true
        };
        setUser(localSession);
        setSelectedLocal(localSession.localAsignado || 'L-01');
        localStorage.setItem('jumbo_heatmap_user', JSON.stringify(localSession));
        return localSession;
      }

      // If credentials failed locally too, throw error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar al servidor backend y las credenciales locales ingresadas son incorrectas.');
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedLocal('L-01');
    localStorage.removeItem('jumbo_heatmap_user');
  };

  const changeLocal = (localId) => {
    if (user && user.rol === 'jefe_general') {
      setSelectedLocal(localId);
    } else {
      console.warn('Los jefes de local no pueden cambiar de sucursal asignada.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        selectedLocal,
        changeLocal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
