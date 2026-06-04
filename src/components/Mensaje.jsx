import React from 'react';

const Mensaje = ({ tipo, texto }) => {
  if (!texto) return null;

  return (
    <div className={`mensaje-alerta ${tipo}`} role="alert" aria-live="assertive">
      <span className="icon" aria-hidden="true">
        {tipo === 'exito' ? '✅' : '❌'}
      </span>
      <div className="message-text">
        {texto}
      </div>
    </div>
  );
};

export default Mensaje;
