import React from 'react';
import Contact from '../components/Contact';
import { MapPin, Phone, Mail } from 'lucide-react';

const locations = [
  { country: 'República Dominicana', address: 'Calle Canasibana #6, Los Cacicazgos, DN, 10133', phone: '(+1) 829 626-0866', email: 'ventas@haxeleragroup.com', map: 'https://maps.google.com/?q=Los+Cacicazgos+Santo+Domingo' },
  { country: 'Estados Unidos', address: '8333 N.W. 53rd Street Suite 450, Doral, FL 33166', phone: '(+1) 786 746-9789', email: 'sales@haxeleragroup.com', map: 'https://maps.google.com/?q=8333+NW+53rd+Street+Doral+FL' },
  { country: 'Guatemala', address: 'Diagonal 6, 10-65 Zona 10, Centro Gerencial Las Margaritas, Oficina 601', phone: '(502) 4172-0060', email: 'ventas@haxeleragroup.com.gt', map: 'https://maps.google.com/?q=Diagonal+6+Zona+10+Guatemala' },
];

export default function ContactPage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="py-20 text-center" style={{ background: 'linear-gradient(135deg, hsla(135,25%,55%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '24px' }}>CONTÁCTANOS</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '16px' }}>
            Estamos en <span className="gradient-text-sage">3 Países</span> para Servirte
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
            Disponibles de lunes a viernes de 8:00 AM a 6:00 PM (hora local). Nuestro equipo de especialistas está listo para atenderte.
          </p>
        </div>
      </section>

      {/* Office cards */}
      <section className="py-12">
        <div className="section-container" style={{ maxWidth: '1100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '64px' }}>
            {locations.map((loc, i) => (
              <a key={i} href={loc.map} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '16px', padding: '32px', cursor: 'pointer', transition: 'var(--transition-smooth)' }}>
                <h3 className="font-heading font-bold text-white" style={{ color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)', fontSize: '1.1rem' }}>{loc.country}</h3>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <MapPin style={{ width: '16px', height: '16px', flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                  <span>{loc.address}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Phone style={{ width: '16px', height: '16px', flexShrink: 0, color: 'var(--primary)' }} />
                  <span>{loc.phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Mail style={{ width: '16px', height: '16px', flexShrink: 0, color: 'var(--primary)' }} />
                  <span>{loc.email}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Embed the Contact Form Component */}
      <Contact />
    </main>
  );
}
