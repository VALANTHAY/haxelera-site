import React from 'react';
import { Award, ShieldAlert, Cpu, Heart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Metrics() {
  const statCards = [
    {
      value: '99.98%',
      label: 'Tasa de Disponibilidad Uptime',
      sub: 'Monitoreo DevOps proactivo constante'
    },
    {
      value: '150+',
      label: 'Proyectos & Nubes Aseguradas',
      sub: 'Despliegues con cero brechas'
    },
    {
      value: '0',
      label: 'Vulnerabilidades Críticas Sin Resolver',
      sub: 'Auditorías exhaustivas y remediation rápida'
    },
    {
      value: '24/7/365',
      label: 'Operación del Centro de Seguridad',
      sub: 'Ingenieros de guardia y respuesta activa'
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Fundación & Filosofía de Diseño Orgánico',
      description: 'Haxelera Group nace con el firme propósito de romper con las metodologías tradicionales. Iniciamos operaciones en República Dominicana como una consultoría boutique dedicada al diseño y desarrollo de arquitecturas de software y seguridad ofensiva.'
    },
    {
      year: '2023',
      title: 'Lanzamiento de HaxSentinel & Expansión Regional',
      description: 'Tras dos años de investigación y desarrollo interno, lanzamos HaxSentinel, nuestro sistema propietario de defensa perimetral con IA. Abrimos oficinas en Estados Unidos y consolidamos alianzas estratégicas para resguardar infraestructuras financieras y gubernamentales.'
    },
    {
      year: '2025',
      title: 'HaxFlow & Consolidación Zero-Trust Multi-Nube',
      description: 'Introducimos HaxFlow para integrar escaneos SAST y SCA directamente en las canalizaciones de despliegue en la nube. Con más de 150 arquitecturas corporativas desplegadas en la región, inauguramos operaciones físicas en Guatemala para dar soporte directo en Centroamérica.'
    }
  ];

  return (
    <section className="relative py-24" style={{ overflow: 'hidden' }}>
      <div className="section-container">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '80px' }}>
          {statCards.map((stat, idx) => (
            <div 
              key={idx}
              className="glass-card flex flex-col justify-between items-center text-center p-6"
              style={{
                background: 'hsla(0,0%,100%,0.02)',
                border: '1px solid hsla(0,0%,100%,0.04)',
                borderRadius: '16px',
                padding: '28px',
                minHeight: '180px'
              }}
            >
              <div 
                className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight mb-2 gradient-text-dual"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}
              >
                {stat.value}
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-white mb-2" style={{ fontSize: '0.9rem' }}>
                  {stat.label}
                </div>
                <div className="font-body text-xs text-muted" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* History Timeline */}
        <div className="grid md:grid-cols-12 gap-12 items-start" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px' }}>
          {/* Timeline Title Card */}
          <div className="md:col-span-5 flex flex-col items-start text-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="section-tag">
              NUESTRA TRAYECTORIA
            </div>
            <h3 className="section-title font-heading font-bold text-white mb-6">
              El Camino Hacia la <span className="gradient-text-sage">Ingeniería Resiliente</span>
            </h3>
            <p className="font-body text-muted leading-relaxed mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Desde nuestros cimientos, nos hemos rehusado a construir sistemas frágiles o a conformarnos con parches de seguridad de último minuto. Nuestra historia está definida por un crecimiento estratégico y el diseño de patentes orientadas a la soberanía tecnológica.
            </p>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-white bg-opacity-5 border-opacity-5" style={{ display: 'flex', gap: '12px', background: 'hsla(0,0%,100%,0.02)', border: '1px solid hsla(0,0%,100%,0.04)', borderRadius: '12px', padding: '16px' }}>
              <ShieldCheck className="w-8 h-8 text-primary" style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <div className="font-body text-xs text-left" style={{ color: 'var(--text-main)', fontSize: '0.75rem' }}>
                <span className="font-bold">Compromiso Inalterable:</span> Tu solución de software es nuestro compromiso absoluto de seguridad.
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="md:col-span-7 flex flex-col gap-10 text-left" style={{ display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
            {milestones.map((ms, idx) => (
              <div 
                key={idx}
                className="relative pl-8 border-l border-white border-opacity-10 group"
                style={{
                  borderLeft: '2px solid hsla(0,0%,100%,0.08)',
                  paddingLeft: '24px',
                  position: 'relative'
                }}
              >
                {/* Visual timeline circle indicator */}
                <div 
                  className="absolute w-4 h-4 rounded-full border bg-black transition-all duration-300 group-hover:scale-125"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: 'var(--bg-color)',
                    borderColor: idx === 1 ? 'var(--accent)' : 'var(--primary)',
                    borderWidth: '2px',
                    left: '-7px',
                    top: '6px',
                    boxShadow: idx === 1 ? '0 0 8px var(--accent)' : '0 0 8px var(--primary)'
                  }}
                ></div>

                {/* Milestone year */}
                <div 
                  className="font-heading font-extrabold text-xl mb-2"
                  style={{
                    color: idx === 1 ? 'var(--accent)' : 'var(--primary)',
                    fontSize: '1.25rem'
                  }}
                >
                  {ms.year}
                </div>

                {/* Milestone copy */}
                <h4 className="font-heading font-bold text-lg text-white mb-2" style={{ fontSize: '1.1rem' }}>
                  {ms.title}
                </h4>
                <p className="font-body text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {ms.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
