import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldAlert, Cpu } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Software', href: '#software' },
    { name: 'Ciberseguridad', href: '#ciberseguridad' },
    { name: 'Productos', href: '#productos' },
    { name: 'Contacto', href: '#contacto' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-4 bg-opacity-70 backdrop-blur-md border-b border-white border-opacity-5 shadow-lg' 
          : 'py-6 bg-transparent border-b border-transparent'
      }`}
      style={{
        backgroundColor: isScrolled ? 'hsla(140, 15%, 7%, 0.75)' : 'transparent',
      }}
    >
      <div className="max-width-1200 mx-auto px-6 flex items-center justify-between" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Brand Logo */}
        <a href="#inicio" className="flex items-center gap-3 text-decoration-none group" style={{ textDecoration: 'none' }}>
          <div className="relative flex items-center justify-center p-2 rounded-lg border border-opacity-10 border-white bg-white bg-opacity-5">
            <Cpu className="w-6 h-6 text-primary group-hover:rotate-90 transition-all duration-500" style={{ color: 'var(--primary)', transition: 'var(--transition-smooth)' }} />
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 rounded-lg blur-sm transition-all duration-300" style={{ backgroundColor: 'var(--primary)' }}></div>
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold tracking-tight flex items-center gap-1" style={{ fontSize: '1.45rem', color: 'var(--primary)' }}>
              HAXELERA GROUP
            </span>
            <span className="text-xs text-muted font-body uppercase tracking-widest font-semibold" style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
              Software & Security
            </span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="font-heading text-sm font-medium tracking-wide transition-all duration-200 text-decoration-none"
                  style={{
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <a href="#contacto" className="btn-accent py-2 px-5 text-sm" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
            Escríbenos
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-opacity-10 border-white bg-white bg-opacity-5 text-white cursor-pointer hover:bg-opacity-10 transition-all"
          style={{ background: 'hsla(0, 0%, 100%, 0.03)', border: '1px solid hsla(0, 0%, 100%, 0.08)' }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 right-0 border-b border-opacity-10 border-white animate-pulse-slow"
          style={{
            backgroundColor: 'var(--bg-color)',
            borderBottom: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            animation: 'none'
          }}
        >
          <ul className="flex flex-col gap-5 p-6 list-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block font-heading text-lg font-medium text-decoration-none"
                  style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-main)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a 
                href="#contacto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-accent w-full justify-center text-center text-decoration-none" 
                style={{ display: 'flex', textDecoration: 'none' }}
              >
                Escríbenos
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
