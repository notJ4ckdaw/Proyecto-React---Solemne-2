import React, { useState, useEffect } from 'react';
import Mensaje from '../components/Mensaje';

const Contacto = () => {
  // 1. Estados para el formulario y mensajes (Hook Obligatorio 4.2)
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [mensajeAlerta, setMensajeAlerta] = useState({ tipo: '', texto: '' });

  // Cambiar el título de la página (Hook Obligatorio 4.2)
  useEffect(() => {
    document.title = 'VCM HeatMap - Contacto';
  }, []);

  // 2. Manejo de inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores visuales al escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 3. Validación de campos obligatorios y formato
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre completo es requerido.';
    }
    if (!formData.correo.trim()) {
      errors.correo = 'El correo electrónico es requerido.';
    } else if (!emailRegex.test(formData.correo)) {
      errors.correo = 'Ingrese un formato de correo electrónico válido (ej. usuario@dominio.com).';
    }
    if (!formData.asunto.trim()) {
      errors.asunto = 'El asunto del mensaje es requerido.';
    }
    if (!formData.mensaje.trim()) {
      errors.mensaje = 'El contenido del mensaje es requerido.';
    } else if (formData.mensaje.trim().length < 10) {
      errors.mensaje = 'El mensaje debe contener al menos 10 caracteres.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 4. Envío de Formulario con Confirmación/Error (RF-03, 4.2)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMensajeAlerta({
        tipo: 'error',
        texto: 'Error de envío: Por favor, complete todos los campos obligatorios correctamente.'
      });
      return;
    }

    // Caso exitoso
    setMensajeAlerta({
      tipo: 'exito',
      texto: '¡Formulario enviado con éxito! Nuestro equipo de soporte técnico procesará tu requerimiento dentro de las próximas 24 horas.'
    });

    // Resetear formulario
    setFormData({
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: ''
    });
    setFormErrors({});

    // Ocultar mensaje automáticamente
    setTimeout(() => {
      setMensajeAlerta({ tipo: '', texto: '' });
    }, 5000);
  };

  return (
    <section className="page-contact">
      <div className="contact-card">
        <h2>Contacto de Soporte Técnico</h2>
        <p>
          ¿Tienes problemas con la lectura de los sensores de afluencia o requieres soporte del sistema VCM? 
          Completa el formulario de abajo y nos pondremos en contacto contigo.
        </p>

        {/* Mensaje de Confirmación / Error (RF-03, 4.1) */}
        <Mensaje tipo={mensajeAlerta.tipo} texto={mensajeAlerta.texto} />

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Campo Nombre (Accesibilidad RNF-01: label asociado a input por id) */}
          <div className={`form-group ${formErrors.nombre ? 'invalid' : ''}`}>
            <label htmlFor="contacto-nombre">Nombre Completo</label>
            <input
              id="contacto-nombre"
              type="text"
              name="nombre"
              placeholder="Ej. Ana María Gómez"
              value={formData.nombre}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={formErrors.nombre ? "true" : "false"}
              aria-describedby={formErrors.nombre ? "nombre-error" : undefined}
            />
            {formErrors.nombre && (
              <span id="nombre-error" className="error-msg">{formErrors.nombre}</span>
            )}
          </div>

          {/* Campo Correo */}
          <div className={`form-group ${formErrors.correo ? 'invalid' : ''}`}>
            <label htmlFor="contacto-correo">Correo Electrónico de Trabajo</label>
            <input
              id="contacto-correo"
              type="email"
              name="correo"
              placeholder="anagomez@supermercado.cl"
              value={formData.correo}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={formErrors.correo ? "true" : "false"}
              aria-describedby={formErrors.correo ? "correo-error" : undefined}
            />
            {formErrors.correo && (
              <span id="correo-error" className="error-msg">{formErrors.correo}</span>
            )}
          </div>

          {/* Campo Asunto */}
          <div className={`form-group ${formErrors.asunto ? 'invalid' : ''}`}>
            <label htmlFor="contacto-asunto">Asunto</label>
            <input
              id="contacto-asunto"
              type="text"
              name="asunto"
              placeholder="Ej. Falla de sensor en zona Frutas y Verduras"
              value={formData.asunto}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={formErrors.asunto ? "true" : "false"}
              aria-describedby={formErrors.asunto ? "asunto-error" : undefined}
            />
            {formErrors.asunto && (
              <span id="asunto-error" className="error-msg">{formErrors.asunto}</span>
            )}
          </div>

          {/* Campo Mensaje */}
          <div className={`form-group ${formErrors.mensaje ? 'invalid' : ''}`}>
            <label htmlFor="contacto-mensaje">Mensaje / Detalle de la Solicitud</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              placeholder="Describe detalladamente el problema o sugerencia..."
              value={formData.mensaje}
              onChange={handleInputChange}
              aria-required="true"
              aria-invalid={formErrors.mensaje ? "true" : "false"}
              aria-describedby={formErrors.mensaje ? "mensaje-error" : undefined}
            ></textarea>
            {formErrors.mensaje && (
              <span id="mensaje-error" className="error-msg">{formErrors.mensaje}</span>
            )}
          </div>

          {/* Acciones */}
          <div className="form-actions" style={{ marginTop: '1.5rem' }}>
            <button type="submit" className="btn-submit" style={{ width: '100%' }}>
              Enviar Mensaje de Soporte
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Contacto;
