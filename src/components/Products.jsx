import React from 'react';
import { Shield, Workflow, Users, Image as ImageIcon, CheckCircle } from 'lucide-react';

export default function Products() {
  const proprietaryProducts = [
    {
      id: 'formesx',
      name: 'FormeSX (HR Solutions)',
      tagline: 'Administración Segura de Recursos Humanos',
      description: 'FormeSX es una aplicación corporativa para la administración y el uso eficiente de las tareas del departamento de RRHH. Permite que los empleados obtengan un medio eficaz para comunicarse, solicitar acciones y obtener retroalimentación constante en un entorno cifrado y seguro.',
      icon: Users,
      image: '/haxflow.png', // Reusing available assets or can use a new one
      accent: 'sage',
      features: [
        'Portal de auto-servicio cifrado para empleados.',
        'Automatización de flujos de aprobación y solicitudes.',
        'Integración con sistemas de identidad (Azure AD, Okta).',
        'Cumplimiento estricto de privacidad y protección de datos.'
      ]
    },
    {
      id: 'mediashelter',
      name: 'Media Shelter',
      tagline: 'Administración Inteligente de Multimedia',
      description: 'Plataforma de administración de activos digitales impulsada por IA. Permite identificar documentos multimedia duplicados, realizar búsquedas inteligentes mediante reconocimiento de imagen y sonido, y personalizar el motor de búsqueda entrenándolo para las necesidades específicas de su corporación.',
      icon: ImageIcon,
      image: '/haxsentinel.png', // Reusing available assets
      accent: 'copper',
      features: [
        'Búsqueda cognitiva y clasificación automática por IA.',
        'Detección inteligente de archivos duplicados y optimización de almacenamiento.',
        'Análisis forense de metadatos de imagen y sonido.',
        'Almacenamiento inmutable y encriptado en la Nube.'
      ]
    },
    {
      id: 'haxsentinel',
      name: 'HaxSentinel',
      tagline: 'Perímetro Inteligente & Detección Activa con IA',
      description: 'HaxSentinel es una plataforma avanzada de detección y respuesta ante amenazas (XDR) impulsada por IA. Escanea constantemente las redes empresariales, aísla vectores de ataque en segundos y neutraliza incidentes críticos de manera autónoma.',
      icon: Shield,
      image: '/haxsentinel.png',
      accent: 'sage',
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
      description: 'HaxFlow es nuestro orquestador DevSecOps de alto rendimiento. Permite a los equipos automatizar compilaciones y despliegues (CI/CD) con escaneos de código estáticos y dinámicos incorporados en cada commit, garantizando el estándar Zero-Trust.',
      icon: Workflow,
      image: '/haxflow.png',
      accent: 'copper',
      features: [
        'Análisis estático de seguridad (SAST) integrado y automático.',
        'Auditoría y control de dependencias rotas y vulnerables (SCA).',
        'Despliegue atómico con rollback automático ante fallas.',
        'Compatibilidad nativa con clusters Kubernetes, Azure y AWS.'
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
          <h2 className="section-title font-heading font-bold text-white max-w-3xl">
            Nuestros <span className="gradient-text-dual">Productos Tecnológicos</span>
          </h2>
          <p className="section-subtitle max-w-2xl">
            Apoyados en nuestra experiencia de Desarrollo y Nube, hemos construido productos que atienden necesidades comunes de nuestros clientes. Estos permiten maximizar el potencial de uso de las tecnologías disponibles para acelerar la transformación digital.
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
                className="glass-card product-grid"
                style={{
                  display: 'grid',
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
                  className="product-image-container"
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
                      Enterprise
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
                  className="product-text-container"
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
