import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    servicio: 'software',
    mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate premium secure form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nombre: '', empresa: '', email: '', servicio: 'software', mensaje: '' });
    }, 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const locations = [
    {
      country: 'República Dominicana',
      address: 'Calle Canasibana #6, Los Cacicazgos, DN, 10133',
      phone: '(+1) 829 626-0866',
      email: 'ventas@haxeleragroup.com'
    },
    {
      country: 'Estados Unidos',
      address: '8333 N.W. 53rd Street Suite 450, Doral, FL 33166',
      phone: '(+1) 786 746-9789',
      email: 'sales@haxeleragroup.com'
    }
  ];

  return (
    <section id="contacto" className="relative py-24" style={{ overflow: 'hidden' }}>
      <div className="section-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '48px' }} className="contact-grid">

          {/* Left Side Details */}
          <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="section-tag section-tag-copper mb-4">
              CONTÁCTANOS
            </div>
            <h3 className="section-title font-heading font-bold text-white mb-6" style={{ width: '100%' }}>
              Inicia la Evolución de tu <span className="gradient-text-sage">Infraestructura</span>
            </h3>
            <p className="font-body text-muted leading-relaxed mb-8 mx-auto md:mx-0" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '540px' }}>
              Ya sea que necesites una arquitectura de software a la medida, migrar tus sistemas a la Nube o proteger tu perímetro digital, nuestro equipo está listo para intervenir.
            </p>

            {/* Office Locations */}
            <div className="flex flex-col gap-6 w-full" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              {locations.map((loc, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-5 rounded-xl border bg-white bg-opacity-5 border-opacity-5" style={{ border: '1px solid hsla(0,0%,100%,0.04)', background: 'hsla(0,0%,100%,0.02)' }}>
                  <h4 className="font-heading font-bold text-base text-white mb-2" style={{ color: idx % 2 === 0 ? 'var(--primary)' : 'var(--accent)' }}>{loc.country}</h4>

                  <div className="flex items-center gap-3 font-body text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <MapPin className="w-4 h-4 text-white opacity-50" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-3 font-body text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Phone className="w-4 h-4 text-white opacity-50" />
                    <span>{loc.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 font-body text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Mail className="w-4 h-4 text-white opacity-50" />
                    <span>{loc.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Form (Glassmorphic) */}
          <div className="md:col-span-7 flex justify-center sticky top-24">
            <div className="glass-card w-full p-8" style={{ width: '100%', border: '1px solid hsla(135, 25%, 55%, 0.12)' }}>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="p-4 rounded-full border border-primary bg-primary-glow text-primary mb-6 animate-pulse-slow">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <h4 className="font-heading font-bold text-2xl text-white mb-3">¡Transmisión Segura Exitosa!</h4>
                  <p className="font-body text-sm text-muted max-w-sm" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Tu solicitud ha sido encriptada y enviada a nuestro SOC. Un arquitecto de soluciones se comunicará contigo en breve.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                  {/* Name and Company Inputs Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div className="flex flex-col gap-2">
                      <label className="font-heading text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Nombre Completo</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ej. Carlos Mendoza"
                        className="p-3 bg-black bg-opacity-35 border border-white border-opacity-5 rounded-lg text-white font-body text-sm focus:outline-none focus:border-primary transition-all"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsla(0,0%,100%,0.06)', borderRadius: '8px', color: 'white' }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-heading text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Empresa</label>
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        required
                        placeholder="Ej. Acme Corp"
                        className="p-3 bg-black bg-opacity-35 border border-white border-opacity-5 rounded-lg text-white font-body text-sm focus:outline-none focus:border-primary transition-all"
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsla(0,0%,100%,0.06)', borderRadius: '8px', color: 'white' }}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-heading text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Correo Electrónico Corporativo</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="carlos@empresa.com"
                      className="p-3 bg-black bg-opacity-35 border border-white border-opacity-5 rounded-lg text-white font-body text-sm focus:outline-none focus:border-primary transition-all w-full"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsla(0,0%,100%,0.06)', borderRadius: '8px', color: 'white' }}
                    />
                  </div>

                  {/* Service Selector Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-heading text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Servicio Requerido</label>
                    <select
                      name="servicio"
                      value={formData.servicio}
                      onChange={handleChange}
                      className="p-3 bg-black bg-opacity-35 border border-white border-opacity-5 rounded-lg text-white font-body text-sm focus:outline-none focus:border-primary transition-all w-full"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsla(0,0%,100%,0.06)', borderRadius: '8px', color: 'white' }}
                    >
                      <option value="software" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Desarrollo de Software</option>
                      <option value="cloud" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Nube & Servicios TI</option>
                      <option value="data" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Data & AI</option>
                      <option value="cybersecurity" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Ciberseguridad & Pentesting</option>
                      <option value="product" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Demo de Producto (FormeSX / Sentinel)</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label className="font-heading text-xs font-semibold uppercase tracking-wider text-muted" style={{ fontSize: '0.7rem' }}>Detalles del Proyecto</label>
                    <textarea
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Describa brevemente sus necesidades y plazos..."
                      className="p-3 bg-black bg-opacity-35 border border-white border-opacity-5 rounded-lg text-white font-body text-sm focus:outline-none focus:border-primary transition-all w-full resize-none"
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid hsla(0,0%,100%,0.06)', borderRadius: '8px', color: 'white' }}
                    ></textarea>
                  </div>

                  {/* Submission Button */}
                  <button type="submit" className="btn-primary w-full justify-center mt-2" style={{ display: 'flex', justifyContent: 'center' }}>
                    Enviar Solicitud
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
