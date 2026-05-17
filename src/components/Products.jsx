import React from 'react';
import { Eye, Shield, Workflow, CheckCircle, Cpu, Zap } from 'lucide-react';

export default function Products() {
  const proprietaryProducts = [
    {
      id: 'haxsentinel',
      name: 'HaxSentinel',
      tagline: 'Perímetro Inteligente & Detección Activa con IA',
      description: 'HaxSentinel es una plataforma avanzada de detección y respuesta ante amenazas (XDR) impulsada por IA. Escanea constantemente las redes empresariales, aísla vectores de ataque en segundos y neutraliza incidentes críticos de manera autónoma antes de que afecten la infraestructura central.',
      icon: Shield,
      accent: 'copper',
      features: [
        'Detección y contención de malware en tiempo real con modelos ML.',
        'Análisis predictivo de comportamiento anómalo en endpoints.',
        'Aislamiento automático de redes y hosts en cuarentena segura.',
        'Consola central de alertas unificadas y reportes de cumplimiento SOC.'
      ]
    },
    {
      id: 'haxflow',
      name: 'HaxFlow',
      tagline: 'Orquestación Segura & Despliegues Multi-Nube',
      description: 'HaxFlow es nuestro orquestador DevSecOps de alto rendimiento. Permite a los equipos de ingeniería automatizar compilaciones y despliegues (CI/CD) con escaneos de código estáticos y dinámicos incorporados en cada commit, garantizando que el software entregado cumpla con el estándar Zero-Trust.',
      icon: Workflow,
      accent: 'sage',
      features: [
        'Análisis estático de seguridad (SAST) integrado y automático.',
        'Auditoría y control de dependencias rotas y vulnerables (SCA).',
        'Despliegue atómico con rollback automático ante fallas.',
        'Compatibilidad nativa con clusters Kubernetes, Azure WebApps y AWS ECS.'
      ]
    }
  ];

  return (
    <section id="productos" className="relative py-24" style={{ overflow: 'hidden' }}>
      {/* Background soft lighting */}
      <div className="ambient-light ambient-light-sage" style={{ top: '30%', right: '20%', opacity: 0.1 }}></div>

      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag section-tag-copper">
            INNOVACIÓN PROPIA
          </div>
          <h2 className="section-title font-heading font-bold text-white max-w-2xl">
            Nuestros <span className="gradient-text-dual">Productos Tecnológicos</span>
          </h2>
          <p className="section-subtitle">
            Además de nuestros servicios de consultoría, desarrollamos herramientas propietarias enfocadas en acelerar la transformación de su empresa de forma segura.
          </p>
        </div>

        {/* Products Showcase */}
        <div className="flex flex-col gap-16" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {proprietaryProducts.map((product, index) => {
            const IconComponent = product.icon;
            const isCopper = product.accent === 'copper';
            const isEven = index % 2 === 0;

            return (
              <div 
                key={product.id}
                className="glass-card grid md:grid-cols-12 gap-8 items-center"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '40px',
                  border: isCopper ? '1px solid hsla(30, 45%, 45%, 0.1)' : '1px solid hsla(135, 25%, 55%, 0.1)',
                  padding: '48px',
                }}
              >
                {/* Product Badge/Icon (visual illustration) */}
                <div 
                  className={`flex flex-col justify-center items-center p-8 rounded-2xl border bg-black bg-opacity-35 order-1 ${
                    isEven ? 'md:order-1 md:col-span-5' : 'md:order-2 md:col-span-5'
                  }`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.3)',
                    borderColor: 'var(--glass-border)',
                    borderRadius: '16px',
                    padding: '40px',
                    minHeight: '260px'
                  }}
                >
                  <div 
                    className="p-4 rounded-full border mb-4 animate-pulse-slow"
                    style={{
                      color: isCopper ? 'var(--accent)' : 'var(--primary)',
                      borderColor: isCopper ? 'hsla(30, 45%, 45%, 0.2)' : 'hsla(135, 25%, 55%, 0.2)',
                      background: isCopper ? 'var(--accent-glow)' : 'var(--primary-glow)',
                    }}
                  >
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <span className="font-heading font-extrabold text-2xl text-white tracking-wide mb-1">
                    {product.name}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-dark)' }}>
                    Enterprise System v2.4
                  </span>
                </div>

                {/* Product Copy Details */}
                <div 
                  className={`flex flex-col items-start text-left order-2 ${
                    isEven ? 'md:order-2 md:col-span-7' : 'md:order-1 md:col-span-7'
                  }`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isCopper ? 'var(--accent)' : 'var(--primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                    <span className="font-heading text-xs font-bold uppercase tracking-wider" style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)' }}>
                      {product.tagline}
                    </span>
                  </div>
                  
                  <p className="font-body text-muted mb-6 leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
                    {product.description}
                  </p>

                  <ul className="flex flex-col gap-3 list-none mb-8" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body text-sm" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        <CheckCircle 
                          className="w-4 h-4 mt-0.5 flex-shrink-0" 
                          style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)' }} 
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a 
                    href="#contacto" 
                    className={isCopper ? 'btn-accent py-2.5 px-6' : 'btn-primary py-2.5 px-6'}
                    style={{ fontSize: '0.9rem' }}
                  >
                    Solicitar Demo de {product.name}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
