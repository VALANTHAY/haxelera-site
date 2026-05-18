import React from 'react';
import { Globe, GitFork, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative border-t border-white border-opacity-5" style={{ borderTop: '1px solid hsla(0, 0%, 100%, 0.05)', backgroundColor: 'hsl(140, 15%, 5%)', padding: '80px 24px 40px' }}>
      
      <div className="max-width-1200 mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-left" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', marginBottom: '64px' }}>
        
        {/* Brand Column */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Haxelera Group Logo" 
              style={{ 
                height: '55px', 
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.15))'
              }} 
            />
          </div>
          <p className="font-body text-xs text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '320px' }}>
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

        {/* Navigation Column */}
        <div className="flex flex-col items-start gap-4">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Navegación
          </h4>
          <ul className="flex flex-col gap-3 font-body text-xs text-muted list-none" style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', paddingLeft: 0 }}>
            <li>
              <Link to="/" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/nosotros" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Nosotros
              </Link>
            </li>
            <li>
              <Link to="/software" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Desarrollo de Software
              </Link>
            </li>
            <li>
              <Link to="/nube" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Servicios Cloud
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Solutions Column */}
        <div className="flex flex-col items-start gap-4">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
            Servicios Avanzados
          </h4>
          <ul className="flex flex-col gap-3 font-body text-xs text-muted list-none" style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '0.75rem', paddingLeft: 0 }}>
            <li>
              <Link to="/software" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Desarrollo Seguro a Medida
              </Link>
            </li>
            <li>
              <Link to="/nube" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Migración & Nube Zero Trust
              </Link>
            </li>
            <li>
              <Link to="/data-ai" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Inteligencia Artificial & Big Data
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-white transition-all text-decoration-none" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Auditorías & Pentesting SOC
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div 
        className="footer-bottom-bar"
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
