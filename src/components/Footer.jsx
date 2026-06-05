import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div>
        <strong>Jumbo Cencosud</strong> &copy; {new Date().getFullYear()} - Sistema de Vinculación con el Medio
      </div>
      <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
        Desarrollado para la Evaluación Solemne 2 | Jumbo Cencosud - VCM
      </div>
    </footer>
  );
};

export default Footer;
