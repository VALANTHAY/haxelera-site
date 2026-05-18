import React from 'react';
import { Cpu, Terminal, GitBranch, Smartphone, Globe, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Aplicaciones Web',
    subtitle: 'Frontend & Backend Engineering',
    desc: 'Desarrollamos plataformas web modernas de alto rendimiento usando las últimas tecnologías (React, Next.js, Node.js). Enfocadas en ofrecer la mejor experiencia de usuario (UX) y una arquitectura segura desde el diseño.',
    features: ['React / Next.js / Vue.js', 'APIs REST y GraphQL', 'PWA y Aplicaciones Offline-First', 'Diseño UI/UX Premium', 'SEO técnico y Core Web Vitals'],
    accent: 'sage',
  },
  {
    icon: Terminal,
    title: 'DevOps',
    subtitle: 'Integración & Entrega Continua',
    desc: 'Automatizamos compilaciones, pruebas y despliegues para que su equipo entregue software de calidad más rápido. Combinamos desarrollo y operaciones para lograr una integración continua (CI/CD) segura y eficiente.',
    features: ['Pipelines CI/CD (GitHub Actions, Azure DevOps)', 'Infraestructura como Código (IaC con Terraform)', 'Contenedores Docker & Kubernetes', 'Monitoreo y Observabilidad (Grafana, Prometheus)', 'Análisis estático SAST/DAST en cada commit'],
    accent: 'copper',
  },
  {
    icon: Smartphone,
    title: 'Aplicaciones Móviles',
    subtitle: 'iOS & Android',
    desc: 'Creamos aplicaciones móviles nativas e híbridas que ofrecen rendimiento premium. Desde la conceptualización hasta el despliegue en las tiendas oficiales, garantizando calidad y seguridad en cada versión.',
    features: ['React Native & Flutter', 'Integración con APIs corporativas', 'Autenticación biométrica y MFA', 'Publicación en App Store y Google Play', 'Mantenimiento y actualizaciones continuas'],
    accent: 'sage',
  },
  {
    icon: Shield,
    title: 'Desarrollo Seguro (DevSecOps)',
    subtitle: 'Seguridad integrada en el ciclo de vida',
    desc: 'Integramos controles de seguridad en cada fase del desarrollo de software (SDLC). Nuestro enfoque Zero-Trust garantiza que cada línea de código entregada haya sido analizada y validada antes de llegar a producción.',
    features: ['Análisis de vulnerabilidades (OWASP Top 10)', 'Pruebas de penetración de código (DAST)', 'Auditoría de dependencias (SCA)', 'Política de seguridad como código', 'Capacitación en Secure Coding para equipos'],
    accent: 'copper',
  },
];

export default function Software() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="relative py-24 text-center" style={{ background: 'linear-gradient(135deg, hsla(135,25%,55%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '24px' }}>DESARROLLO DE SOFTWARE</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '24px' }}>
            Ingeniería de Software <span className="gradient-text-sage">Segura</span> & <span className="gradient-text-copper">Escalable</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Creamos e integramos aplicaciones personalizadas para el ecosistema corporativo de manera estable, innovadora y eficiente, optimizando sus procesos de negocio.
          </p>
          <a href="#contacto" className="btn-primary" style={{ display: 'inline-flex' }}>
            Solicitar Consultoría Gratuita <ArrowRight style={{ width: '16px', height: '16px' }} />
          </a>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {services.map((s, i) => {
            const isCopper = s.accent === 'copper';
            const isReversed = i % 2 !== 0;
            return (
              <div key={i} className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', padding: '48px', direction: isReversed ? 'rtl' : 'ltr' }}>
                <div style={{ direction: 'ltr' }}>
                  <s.icon style={{ width: '40px', height: '40px', color: isCopper ? 'var(--accent)' : 'var(--primary)', marginBottom: '20px' }} />
                  <p style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{s.subtitle}</p>
                  <h2 className="font-heading font-bold text-white" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{s.title}</h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{s.desc}</p>
                </div>
                <div style={{ direction: 'ltr' }}>
                  <h4 className="font-heading font-bold text-white mb-6" style={{ marginBottom: '20px', fontSize: '1rem' }}>Incluye:</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0 }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0, color: isCopper ? 'var(--accent)' : 'var(--primary)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contacto" className={isCopper ? 'btn-accent' : 'btn-primary'} style={{ display: 'inline-flex', marginTop: '28px', fontSize: '0.875rem' }}>
                    Hablar con un Experto <ArrowRight style={{ width: '14px', height: '14px' }} />
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
