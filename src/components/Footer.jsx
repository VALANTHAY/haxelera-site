import React from 'react';
import { Phone, MapPin, Mail, Shield, Globe, GitFork, Send } from 'lucide-react';

export default function Footer() {
  const offices = [
    {
      country: 'República Dominicana',
      phone: '(+1) 809 789-5432',
      address: 'Torre Haxelera, Av. Winston Churchill #109, Piantini, Santo Domingo, DN, 10148',
      email: 'ventas.dr@haxelera.com'
    },
    {
      country: 'Estados Unidos',
      phone: '(+1) 305 456-7890',
      address: '1200 Brickell Ave, Suite 800, Miami, FL 33131',
      email: 'sales.us@haxelera.com'
    },
    {
      country: 'Guatemala',
      phone: '(+502) 2333-8888',
      address: 'Diagonal 6, 12-34 Zona 10, Centro Gerencial Margaritas, Torre II, Oficina 902',
      email: 'ventas.gt@haxelera.com'
    }
  ];

  return (
    <footer className="relative border-t border-white border-opacity-5" style={{ borderTop: '1px solid hsla(0, 0%, 100%, 0.05)', backgroundColor: 'hsl(140, 15%, 5%)', padding: '80px 24px 40px' }}>
      
      <div className="max-width-1200 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 text-left" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px', marginBottom: '64px' }}>
        
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Haxelera Group Logo" 
              style={{ 
                height: '60px', 
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 153, 0.2))'
              }} 
            />
          </div>
          <p className="font-body text-xs text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Líderes en ingeniería de software y ciberseguridad corporativa. Diseñamos arquitecturas seguras y de alto impacto para proteger el futuro de su negocio.
          </p>
          {/* Social Links */}
          <div className="flex gap-4 mt-4" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="#" className="p-2 rounded-full border border-white border-opacity-5 bg-white bg-opacity-5 text-white hover:text-primary hover:border-primary transition-all duration-300">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full border border-white border-opacity-5 bg-white bg-opacity-5 text-white hover:text-primary hover:border-primary transition-all duration-300">
              <GitFork className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-full border border-white border-opacity-5 bg-white bg-opacity-5 text-white hover:text-primary hover:border-primary transition-all duration-300">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Office Columns */}
        {offices.map((office, idx) => (
          <div key={idx} className="flex flex-col items-start gap-4">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              {office.country}
            </h4>
            <ul className="flex flex-col gap-3 font-body text-xs text-muted list-none" style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <a href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  {office.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <span>{office.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" style={{ color: 'var(--primary)' }} />
                <a href={`mailto:${office.email}`} className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  {office.email}
                </a>
              </li>
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Copyright Bar */}
      <div 
        className="max-width-1200 mx-auto pt-8 border-t border-white border-opacity-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body text-muted"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '32px',
          borderTop: '1px solid hsla(0, 0%, 100%, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--text-dark)',
          fontSize: '0.75rem'
        }}
      >
        <span>
          © {new Date().getFullYear()} Haxelera Group. Todos los derechos reservados.
        </span>
        <div className="flex gap-6" style={{ display: 'flex', gap: '24px' }}>
          <a href="#" className="hover:text-muted transition-all text-decoration-none" style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>Declaración de Privacidad</a>
          <a href="#" className="hover:text-muted transition-all text-decoration-none" style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>Términos de Uso</a>
          <a href="#" className="hover:text-muted transition-all text-decoration-none" style={{ color: 'var(--text-dark)', textDecoration: 'none' }}>Mapa del Sitio</a>
        </div>
      </div>
    </footer>
  );
}
