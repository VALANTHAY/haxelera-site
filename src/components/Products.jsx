import React from 'react';
import { Shield, Workflow, CheckCircle } from 'lucide-react';

export default function Products() {
  const proprietaryProducts = [
    {
      id: 'haxsentinel',
      name: 'HaxSentinel',
      tagline: 'Perímetro Inteligente & Detección Activa con IA',
      description: 'HaxSentinel es una plataforma avanzada de detección y respuesta ante amenazas (XDR) impulsada por IA. Escanea constantemente las redes empresariales, aísla vectores de ataque en segundos y neutraliza incidentes críticos de manera autónoma antes de que afecten la infraestructura central.',
      icon: Shield,
      image: '/haxsentinel.png',
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
      image: '/haxflow.png',
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag section-tag-copper">
            INNOVACIÓN PROPIA
          </div>
          <h2 className="section-title font-heading font-bold text-white">
            Nuestros <span className="gradient-text-dual">Productos Tecnológicos</span>
          </h2>
          <p className="section-subtitle">
            Además de nuestros servicios de consultoría, desarrollamos herramientas propietarias enfocadas en acelerar la transformación de su empresa de forma segura.
          </p>
        </div>

        {/* Products Showcase */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {proprietaryProducts.map((product, index) => {
            const IconComponent = product.icon;
            const isCopper = product.accent === 'copper';
            const isReversed = index % 2 !== 0;

            return (
              <div 
                key={product.id}
                className="glass-card"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0',
                  border: isCopper ? '1px solid hsla(30, 45%, 45%, 0.15)' : '1px solid hsla(135, 25%, 55%, 0.15)',
                  padding: '0',
                  overflow: 'hidden',
                  borderRadius: '20px',
                }}
              >
                {/* Image Side */}
                <div 
                  style={{
                    position: 'relative',
                    minHeight: '420px',
                    order: isReversed ? 2 : 1,
                    overflow: 'hidden',
                  }}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.9,
                      transition: 'transform 0.7s ease, opacity 0.5s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.9'; }}
                  />
                  
                  {/* Gradient overlay for readability */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: isReversed 
                      ? 'linear-gradient(to left, rgba(0,0,0,0.7) 0%, transparent 100%)'
                      : 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }}></div>

                  {/* Product badge overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 2,
                  }}>
                    <IconComponent style={{ width: '20px', height: '20px', color: isCopper ? 'var(--accent)' : 'var(--primary)' }} />
                    <span className="font-heading font-extrabold text-white" style={{ fontSize: '1.3rem' }}>
                      {product.name}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                      v2.4
                    </span>
                  </div>
                </div>

                {/* Text Side */}
                <div 
                  style={{
                    padding: '48px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    order: isReversed ? 1 : 2,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      backgroundColor: isCopper ? 'var(--accent)' : 'var(--primary)',
                    }}></span>
                    <span className="font-heading" style={{ 
                      fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      color: isCopper ? 'var(--accent)' : 'var(--primary)' 
                    }}>
                      {product.tagline}
                    </span>
                  </div>
                  
                  <p className="font-body" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.7 }}>
                    {product.description}
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', listStyle: 'none', padding: 0, margin: 0 }}>
                    {product.features.map((feature, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        <CheckCircle 
                          style={{ 
                            width: '16px', height: '16px', flexShrink: 0, marginTop: '2px',
                            color: isCopper ? 'var(--accent)' : 'var(--primary)' 
                          }} 
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a 
                    href="#contacto" 
                    className={isCopper ? 'btn-accent' : 'btn-primary'}
                    style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}
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
