import React, { useState } from 'react';
import { Send, FileText, Clock, ShieldCheck } from 'lucide-react';

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

  return (
    <section id="contacto" className="relative py-24" style={{ overflow: 'hidden' }}>
      <div className="section-container">
        <div className="grid md:grid-cols-12 gap-12 items-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          
          {/* Left Side Details */}
          <div className="md:col-span-5 flex flex-col items-start text-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="section-tag section-tag-copper">
              CONTÁCTANOS
            </div>
            <h3 className="section-title font-heading font-bold text-white mb-6">
              Inicia la Evolución de tu <span className="gradient-text-sage">Infraestructura</span>
            </h3>
            <p className="font-body text-muted leading-relaxed mb-8" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px' }}>
              Ya sea que necesites una arquitectura de software a la medida desde cero o auditar tu perímetro de ciberseguridad actual, nuestro equipo de ingenieros élite está listo para intervenir.
            </p>

            {/* Quick trust metrics */}
            <div className="flex flex-col gap-6 w-full" style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg border bg-white bg-opacity-5 border-opacity-5 text-primary" style={{ color: 'var(--primary)', border: '1px solid hsla(0,0%,100%,0.04)', background: 'hsla(0,0%,100%,0.02)' }}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white mb-1">Respuesta en Menos de 24 Horas</h4>
                  <p className="font-body text-xs text-muted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Reciba retroalimentación rápida de un especialista asignado.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg border bg-white bg-opacity-5 border-opacity-5 text-accent" style={{ color: 'var(--accent)', border: '1px solid hsla(0,0%,100%,0.04)', background: 'hsla(0,0%,100%,0.02)' }}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white mb-1">Acuerdo de Confidencialidad (NDA)</h4>
                  <p className="font-body text-xs text-muted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Protegemos tu Propiedad Intelectual e información confidencial de inmediato.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg border bg-white bg-opacity-5 border-opacity-5 text-primary" style={{ color: 'var(--primary)', border: '1px solid hsla(0,0%,100%,0.04)', background: 'hsla(0,0%,100%,0.02)' }}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-white mb-1">Garantía Secure-By-Design</h4>
                  <p className="font-body text-xs text-muted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Todos nuestros entregables son auditados antes del despliegue.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Form (Glassmorphic) */}
          <div className="md:col-span-7 flex justify-center">
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
                        placeholder="Ej. Haxelera Tech" 
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
                      <option value="software" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Desarrollo de Software a Medida</option>
                      <option value="cybersecurity" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Ciberseguridad & Pentesting</option>
                      <option value="devops" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Arquitectura Cloud / DevSecOps</option>
                      <option value="product" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Demo de Producto (Sentinel / Flow)</option>
                      <option value="audit" style={{ backgroundColor: 'var(--bg-color)', color: 'white' }}>Auditoría & Cumplimiento TI</option>
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
                    Enviar Conexión Segura
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
