import React from 'react';
import { Cloud as CloudIcon, Server, Monitor, HardDriveUpload, CheckCircle, ArrowRight } from 'lucide-react';

const cloudServices = [
  {
    icon: CloudIcon,
    title: 'Servicios de TI en la Nube',
    subtitle: 'Adopción & Modernización',
    desc: 'Aceleramos la adopción de la nube mediante continuidad de negocio, modernización de Data Centers y creación de infraestructura híbrida altamente escalable y protegida. Somos Partners certificados de Microsoft Azure y Amazon AWS.',
    features: ['Arquitectura Multi-Cloud y Nube Híbrida', 'Implementación de Azure / AWS / GCP', 'Continuidad de Negocio y Disaster Recovery', 'Optimización de costos cloud (FinOps)', 'Ambientes de desarrollo y producción aislados'],
    accent: 'sage',
  },
  {
    icon: Server,
    title: 'Servicios Manejados (MSP)',
    subtitle: 'Gestión Proactiva 24/7',
    desc: 'Gestión proactiva y soporte continuo de su infraestructura tecnológica. Garantizamos una disponibilidad del 99.9% y un rendimiento óptimo, liberando a su equipo interno para que se enfoque en el negocio.',
    features: ['Monitoreo proactivo 24/7/365', 'Helpdesk y soporte técnico multi-nivel', 'Gestión de parches y actualizaciones de seguridad', 'Respaldo y recuperación ante desastres', 'SLAs garantizados por contrato'],
    accent: 'copper',
  },
  {
    icon: Monitor,
    title: 'Escritorios Virtuales (VDI)',
    subtitle: 'Modern Workplace',
    desc: 'Implementación, seguridad y administración de entornos de trabajo colaborativos remotos y seguros. Control total de identidades y accesos con Azure Virtual Desktop y Windows 365.',
    features: ['Azure Virtual Desktop (AVD)', 'Windows 365 Cloud PC', 'Microsoft 365 y colaboración', 'Control de identidades (Azure AD / Entra ID)', 'Políticas de acceso condicional (Zero Trust)'],
    accent: 'sage',
  },
  {
    icon: HardDriveUpload,
    title: 'Migración a la Nube',
    subtitle: 'Lift & Shift | Replatforming',
    desc: 'Transición fluida de sus cargas de trabajo hacia infraestructuras en la nube (Azure, AWS, GCP). Estrategias de migración sin pérdida de datos ni ventanas de inactividad no planificadas.',
    features: ['Evaluación y plan de migración (WAF)', 'Migración de servidores físicos y virtuales', 'Migración de bases de datos (SQL, Oracle)', 'Estrategias Lift & Shift, Replatform, Refactor', 'Validación y pruebas post-migración'],
    accent: 'copper',
  },
];

export default function CloudPage() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="relative py-24 text-center" style={{ background: 'linear-gradient(135deg, hsla(30,45%,45%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <div className="section-tag section-tag-copper" style={{ display: 'inline-flex', marginBottom: '24px' }}>NUBE & SERVICIOS TI</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '24px' }}>
            Infraestructura <span className="gradient-text-copper">Resiliente</span> en la <span className="gradient-text-sage">Nube</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Como Microsoft Gold Partner, diseñamos, migramos y operamos infraestructuras cloud de misión crítica con los más altos estándares de seguridad y disponibilidad de la industria.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/contacto" className="btn-primary" style={{ display: 'inline-flex' }}>Consultoría Gratuita <ArrowRight style={{ width: '16px', height: '16px' }} /></a>
            <a href="/nosotros" className="btn-secondary" style={{ display: 'inline-flex' }}>Ver Certificaciones</a>
          </div>
        </div>
      </section>

      {/* Cloud Services */}
      <section className="py-20">
        <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {cloudServices.map((s, i) => {
            const isCopper = s.accent === 'copper';
            return (
              <div key={i} className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', padding: '48px' }}>
                <div>
                  <s.icon style={{ width: '40px', height: '40px', color: isCopper ? 'var(--accent)' : 'var(--primary)', marginBottom: '20px' }} />
                  <p style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{s.subtitle}</p>
                  <h2 className="font-heading font-bold text-white" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{s.title}</h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{s.desc}</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white" style={{ marginBottom: '20px', fontSize: '1rem' }}>Incluye:</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0 }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0, color: isCopper ? 'var(--accent)' : 'var(--primary)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contacto" className={isCopper ? 'btn-accent' : 'btn-primary'} style={{ display: 'inline-flex', marginTop: '28px', fontSize: '0.875rem' }}>
                    Solicitar Propuesta <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
