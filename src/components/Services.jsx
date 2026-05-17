import React from 'react';
import { Cpu, Terminal, ShieldAlert, Cloud, Database, FileCheck } from 'lucide-react';

export default function Services() {
  const coreServices = [
    {
      icon: Cpu,
      title: 'Desarrollo de Software a Medida',
      description: 'Ingeniería de software premium con arquitecturas limpias y seguras. Diseñamos sistemas de alto rendimiento utilizando React para el frontend y Node.js para el backend robusto, asegurando mantenibilidad y legibilidad absoluta.',
      accent: 'sage',
      tag: 'Ingeniería'
    },
    {
      icon: Terminal,
      title: 'Arquitectura DevOps & SRE',
      description: 'Despliegues automatizados sin fricción. Diseñamos infraestructuras como código sólidas e implementamos prácticas DevOps para combinar eficiencia operativa y seguridad continua (DevSecOps) en la nube.',
      accent: 'sage',
      tag: 'Operaciones'
    },
    {
      icon: ShieldAlert,
      title: 'Ciberseguridad Ofensiva & Defensiva',
      description: 'Protección impenetrable de activos. Realizamos pentesting ético avanzado, auditorías de vulnerabilidad y configuramos perímetros de seguridad activos con aislamiento inteligente de amenazas.',
      accent: 'copper',
      tag: 'Seguridad'
    },
    {
      icon: Cloud,
      title: 'Cloud Security & Modern Workplace',
      description: 'Migración y control de identidad Zero-Trust. Protegemos su espacio de trabajo y nubes empresariales (Microsoft Azure, AWS, Google Cloud) mediante políticas rigurosas de autenticación multi-factor y cifrado.',
      accent: 'sage',
      tag: 'Nube'
    },
    {
      icon: Database,
      title: 'Data, Analytics & IA Segura',
      description: 'Flujos de datos robustos e integraciones seguras de Inteligencia Artificial. Blindamos sus conductos de datos y entrenamos modelos predictivos resguardando la confidencialidad de la información crítica.',
      accent: 'sage',
      tag: 'Inteligencia'
    },
    {
      icon: FileCheck,
      title: 'Auditoría & Cumplimiento TI',
      description: 'Evaluación y preparación para marcos regulatorios (ISO 27001, SOC 2, HIPAA). Analizamos y remediamos brechas de cumplimiento para garantizar la tranquilidad y confiabilidad de su corporación.',
      accent: 'copper',
      tag: 'Cumplimiento'
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
            Soluciones Integrales de <span className="gradient-text-sage">Software</span> & <span className="gradient-text-copper">Ciberseguridad</span>
          </h2>
          <p className="section-subtitle">
            Combinamos el desarrollo de arquitecturas web estables con la defensa digital avanzada para ofrecer soluciones confiables, modulares y seguras por diseño.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {coreServices.map((service, index) => {
            const IconComponent = service.icon;
            const isCopper = service.accent === 'copper';
            
            return (
              <div 
                key={index} 
                className={`glass-card flex flex-col items-start text-left group ${
                  isCopper ? 'glass-card-copper' : ''
                }`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
              >
                {/* Service Tag */}
                <div 
                  className="font-heading font-semibold text-xs tracking-wider uppercase mb-6 px-3 py-1 rounded-full border"
                  style={{
                    fontSize: '0.65rem',
                    marginBottom: '24px',
                    backgroundColor: isCopper ? 'hsla(30, 45%, 45%, 0.08)' : 'hsla(135, 25%, 55%, 0.08)',
                    borderColor: isCopper ? 'hsla(30, 45%, 45%, 0.2)' : 'hsla(135, 25%, 55%, 0.2)',
                    color: isCopper ? 'var(--accent)' : 'var(--primary)'
                  }}
                >
                  {service.tag}
                </div>

                {/* Icon Container */}
                <div 
                  className="p-4 rounded-xl border mb-6 flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: 'hsla(0,0%,100%,0.02)',
                    borderColor: 'var(--glass-border)',
                    marginBottom: '24px',
                    color: isCopper ? 'var(--accent)' : 'var(--primary)',
                    boxShadow: isCopper ? '0 0 15px -3px var(--accent-glow)' : '0 0 15px -3px var(--primary-glow)'
                  }}
                >
                  <IconComponent className="w-7 h-7 group-hover:scale-110 transition-all duration-300" />
                </div>

                {/* Service Text */}
                <h3 className="font-heading font-bold text-xl mb-4 text-white group-hover:gradient-text-sage transition-all duration-300" style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
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
