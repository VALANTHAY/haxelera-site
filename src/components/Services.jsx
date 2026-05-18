import React from 'react';
import { Cpu, Terminal, Cloud, Database, MonitorPlay, ServerCog, HardDriveUpload, Users } from 'lucide-react';

export default function Services() {
  const coreServices = [
    {
      icon: Terminal,
      title: 'DevOps',
      description: 'Automatización de despliegues y control de calidad continuo. Combinamos de manera eficiente el desarrollo de software y las operaciones para integrar, probar y entregar continuamente aplicaciones seguras.',
      accent: 'sage',
      tag: 'Operaciones'
    },
    {
      icon: Cpu,
      title: 'Desarrollo de Software',
      description: 'Creamos e integramos aplicaciones personalizadas para el ecosistema corporativo de manera estable, innovadora y eficiente, optimizando sus procesos de negocio.',
      accent: 'copper',
      tag: 'Ingeniería'
    },
    {
      icon: ServerCog,
      title: 'Servicios Manejados',
      description: 'Gestión proactiva y soporte continuo de su infraestructura tecnológica, asegurando una disponibilidad de 99.9% y un rendimiento óptimo en sus operaciones críticas.',
      accent: 'sage',
      tag: 'Soporte'
    },
    {
      icon: Cloud,
      title: 'Servicios de TI en la Nube',
      description: 'Aceleramos la adopción de la nube mediante continuidad de negocio, modernización de Data Centers y creación de infraestructura híbrida altamente escalable y protegida.',
      accent: 'sage',
      tag: 'Nube'
    },
    {
      icon: Database,
      title: 'Data & AI',
      description: 'Ofrecemos información práctica de valor para transformar su empresa. Procesamos, analizamos y aseguramos sus datos para permitirle tomar decisiones precisas mediante Inteligencia Artificial.',
      accent: 'copper',
      tag: 'Inteligencia'
    },
    {
      icon: MonitorPlay,
      title: 'Aplicaciones Web',
      description: 'Desarrollo de plataformas web modernas de alto rendimiento, enfocadas en ofrecer la mejor experiencia de usuario y seguridad perimetral integrada por diseño.',
      accent: 'sage',
      tag: 'Ingeniería Web'
    },
    {
      icon: HardDriveUpload,
      title: 'Migración a la Nube',
      description: 'Transición fluida de sus cargas de trabajo hacia infraestructuras en la nube (Azure, AWS). Estrategias de migración sin pérdida de datos ni ventanas de inactividad.',
      accent: 'sage',
      tag: 'Infraestructura'
    },
    {
      icon: Users,
      title: 'Lugar de Trabajo Moderno',
      description: 'Implementación, seguridad y administración de entornos de trabajo colaborativos remotos y seguros (Modern Workplace), con control total de identidades y accesos.',
      accent: 'copper',
      tag: 'Colaboración'
    }
  ];

  return (
    <section id="software" className="relative py-24" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Target anchor for cybersecurity */}
      <div id="ciberseguridad" style={{ position: 'absolute', top: '150px' }}></div>
      
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag">
            NUESTRAS CAPACIDADES
          </div>
          <h2 className="section-title font-heading font-bold text-white max-w-2xl">
            Soluciones Integrales de <span className="gradient-text-sage">Software</span> & <span className="gradient-text-copper">Nube</span>
          </h2>
          <p className="section-subtitle">
            Enfocados en optimizar procesos, mejorar su competitividad y ofrecer valor añadido a nuestros clientes mediante la adopción de arquitecturas seguras y resilientes.
          </p>
        </div>

        {/* Services Grid (8 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {coreServices.map((service, index) => {
            const IconComponent = service.icon;
            const isCopper = service.accent === 'copper';
            
            return (
              <div 
                key={index} 
                className={`glass-card flex flex-col items-start text-left group ${
                  isCopper ? 'glass-card-copper' : ''
                }`}
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                  padding: '32px 24px', minHeight: '320px', justifyContent: 'flex-start'
                }}
              >
                {/* Service Tag */}
                <div 
                  className="font-heading font-semibold text-xs tracking-wider uppercase mb-6 px-3 py-1 rounded-full border"
                  style={{
                    fontSize: '0.65rem',
                    marginBottom: '20px',
                    backgroundColor: isCopper ? 'hsla(30, 45%, 45%, 0.08)' : 'hsla(135, 25%, 55%, 0.08)',
                    borderColor: isCopper ? 'hsla(30, 45%, 45%, 0.2)' : 'hsla(135, 25%, 55%, 0.2)',
                    color: isCopper ? 'var(--accent)' : 'var(--primary)'
                  }}
                >
                  {service.tag}
                </div>

                {/* Icon Container */}
                <div 
                  className="p-3 rounded-xl border mb-5 flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'hsla(0,0%,100%,0.02)',
                    borderColor: 'var(--glass-border)',
                    marginBottom: '20px',
                    color: isCopper ? 'var(--accent)' : 'var(--primary)',
                    boxShadow: isCopper ? '0 0 15px -3px var(--accent-glow)' : '0 0 15px -3px var(--primary-glow)'
                  }}
                >
                  <IconComponent className="w-6 h-6 group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Service Text */}
                <h3 className="font-heading font-bold text-lg mb-3 text-white group-hover:gradient-text-sage transition-all duration-300" style={{ fontSize: '1.15rem', marginBottom: '12px' }}>
                  {service.title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
