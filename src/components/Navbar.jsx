import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, ChevronDown, Building2, Users, Star, Briefcase, Globe, Terminal, Cloud, Database, BookOpen, Mail, Shield, Cpu as CpuIcon, Smartphone } from 'lucide-react';

const megaMenuData = [
  {
    label: 'Nosotros',
    path: '/nosotros',
    items: [
      { label: 'Nuestra Historia', path: '/nosotros', icon: Building2, desc: 'Conoce cómo nacimos y crecimos.' },
      { label: 'Nuestro Equipo', path: '/nosotros#equipo', icon: Users, desc: 'Los ingenieros detrás del éxito.' },
      { label: 'Clientes', path: '/nosotros#clientes', icon: Star, desc: 'Más de 500 proyectos entregados.' },
      { label: 'Vacantes', path: '/nosotros#vacantes', icon: Briefcase, desc: 'Únete a nuestro equipo global.' },
    ]
  },
  {
    label: 'Desarrollo de Software',
    path: '/software',
    items: [
      { label: 'Aplicaciones Web', path: '/software#web', icon: Globe, desc: 'React, Node.js, APIs REST.' },
      { label: 'DevOps', path: '/software#devops', icon: Terminal, desc: 'CI/CD, Kubernetes, Terraform.' },
      { label: 'Apps Móviles', path: '/software#mobile', icon: Smartphone, desc: 'React Native, Flutter.' },
      { label: 'Desarrollo Seguro', path: '/software#devsecops', icon: Shield, desc: 'SAST, DAST, DevSecOps.' },
    ]
  },
  {
    label: 'Nube & Servicios TI',
    path: '/nube',
    items: [
      { label: 'Nube (Azure / AWS)', path: '/nube#cloud', icon: Cloud, desc: 'Arquitectura e implementación.' },
      { label: 'Servicios Manejados', path: '/nube#msp', icon: CpuIcon, desc: 'Soporte 24/7 garantizado.' },
      { label: 'Escritorios Virtuales', path: '/nube#vdi', icon: Globe, desc: 'Modern Workplace, AVD.' },
      { label: 'Migración a la Nube', path: '/nube#migration', icon: Database, desc: 'Sin pérdida de datos.' },
    ]
  },
  {
    label: 'Data & AI',
    path: '/data-ai',
    items: [
      { label: 'Data Engineering', path: '/data-ai#engineering', icon: Database, desc: 'Pipelines, Data Lakes, ETL.' },
      { label: 'Machine Learning', path: '/data-ai#ml', icon: CpuIcon, desc: 'Modelos predictivos y generativos.' },
      { label: 'Business Intelligence', path: '/data-ai#bi', icon: Star, desc: 'Dashboards y reportes en tiempo real.' },
    ]
  },
  {
    label: 'Cursos',
    path: '/cursos',
    items: [
      { label: 'Ciberseguridad Ofensiva', path: '/cursos#ciber', icon: Shield, desc: 'Ethical Hacking, OSCP.' },
      { label: 'DevOps & Cloud', path: '/cursos#devops', icon: Cloud, desc: 'Docker, K8s, Terraform.' },
      { label: 'Data Science & ML', path: '/cursos#data', icon: Database, desc: 'Python, TensorFlow, MLOps.' },
      { label: 'Desarrollo Full-Stack', path: '/cursos#web', icon: BookOpen, desc: 'React, Node.js, AWS.' },
    ]
  },
];

function MegaDropdown({ items, isVisible }) {
  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 12px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '420px',
      background: 'hsla(140, 15%, 6%, 0.98)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid hsla(135, 25%, 55%, 0.15)',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.6), 0 0 30px hsla(135, 25%, 55%, 0.05)',
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'all' : 'none',
      transform: isVisible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      zIndex: 9999,
    }}>
      {/* Arrow */}
      <div style={{
        position: 'absolute',
        top: '-6px',
        left: '50%',
        transform: 'translateX(-50%) rotate(45deg)',
        width: '12px',
        height: '12px',
        background: 'hsla(140, 15%, 6%, 0.98)',
        borderTop: '1px solid hsla(135, 25%, 55%, 0.15)',
        borderLeft: '1px solid hsla(135, 25%, 55%, 0.15)',
      }}></div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {items.map((item, i) => (
          <Link
            key={i}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
              background: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'hsla(135, 25%, 55%, 0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ padding: '8px', borderRadius: '8px', background: 'hsla(135, 25%, 55%, 0.1)', flexShrink: 0 }}>
              <item.icon style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-heading)', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.4 }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location]);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        backgroundColor: isScrolled ? 'hsla(140, 15%, 7%, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid hsla(0,0%,100%,0.05)' : '1px solid transparent',
        padding: isScrolled ? '12px 0' : '20px 0',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'hsla(0,0%,100%,0.04)', border: '1px solid hsla(0,0%,100%,0.08)' }}>
            <Cpu style={{ width: '22px', height: '22px', color: 'var(--primary)' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              HAXELERA GROUP
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Software & Security
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="md:flex hidden">
          {megaMenuData.map((item) => (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: location.pathname.startsWith(item.path) && item.path !== '/' ? 'var(--primary)' : 'var(--text-muted)',
                  transition: 'color 0.2s ease, background 0.2s ease',
                  background: openDropdown === item.label ? 'hsla(0,0%,100%,0.05)' : 'transparent',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-main)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = location.pathname.startsWith(item.path) && item.path !== '/' ? 'var(--primary)' : 'var(--text-muted)'; }}
              >
                {item.label}
                <ChevronDown style={{ width: '14px', height: '14px', transition: 'transform 0.2s ease', transform: openDropdown === item.label ? 'rotate(180deg)' : 'none' }} />
              </Link>

              <MegaDropdown items={item.items} isVisible={openDropdown === item.label} />
            </div>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/contacto"
            className="btn-accent md:flex hidden"
            style={{ padding: '10px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
          >
            <Mail style={{ width: '14px', height: '14px' }} />
            Contáctanos
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'hsla(0,0%,100%,0.04)', border: '1px solid hsla(0,0%,100%,0.08)', borderRadius: '8px', padding: '8px', color: 'white', cursor: 'pointer', display: 'flex' }}
            className="md:hidden"
          >
            {isMobileMenuOpen ? <X style={{ width: '22px', height: '22px' }} /> : <Menu style={{ width: '22px', height: '22px' }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div style={{
          background: 'hsla(140, 15%, 5%, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid hsla(0,0%,100%,0.05)',
          padding: '16px 24px 24px',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          {megaMenuData.map((item) => (
            <div key={item.label} style={{ borderBottom: '1px solid hsla(0,0%,100%,0.04)', marginBottom: '4px' }}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 0',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {item.label}
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'none' }} />
              </button>
              {mobileExpanded === item.label && (
                <div style={{ paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {item.items.map((sub, si) => (
                    <Link
                      key={si}
                      to={sub.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        fontFamily: 'var(--font-heading)',
                        background: 'hsla(0,0%,100%,0.02)',
                      }}
                    >
                      <sub.icon style={{ width: '16px', height: '16px', color: 'var(--primary)', flexShrink: 0 }} />
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-accent"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', textDecoration: 'none' }}
          >
            Contáctanos
          </Link>
        </div>
      )}
    </nav>
  );
}
