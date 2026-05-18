import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Haxelera Group reestructuró por completo nuestra infraestructura legacy. La transición a Zero-Trust fue imperceptible para nuestros usuarios, pero el nivel de seguridad es ahora impenetrable.",
      author: "Director de TI",
      company: "Fintech Internacional",
      accent: "sage"
    },
    {
      quote: "No solo diseñaron un software de alto rendimiento, sino que su enfoque 'secure-by-design' nos ahorró meses en auditorías de cumplimiento SOC 2. Verdaderos expertos.",
      author: "CEO",
      company: "Startup HealthTech",
      accent: "copper"
    }
  ];

  return (
    <section className="relative py-24" style={{ overflow: 'hidden' }}>
      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag">
            CASOS DE ÉXITO
          </div>
          <h2 className="section-title font-heading font-bold text-white max-w-2xl">
            La Confianza de <span className="gradient-text-sage">Líderes</span> de la Industria
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', margin: '0 auto', maxWidth: '1024px' }}>
          {testimonials.map((test, index) => {
            const isCopper = test.accent === 'copper';
            
            return (
              <div 
                key={index}
                className={`glass-card relative flex flex-col p-10 ${isCopper ? 'glass-card-copper' : ''}`}
                style={{
                  border: isCopper ? '1px solid hsla(30, 45%, 45%, 0.1)' : '1px solid hsla(135, 25%, 55%, 0.1)',
                  padding: '40px'
                }}
              >
                <Quote 
                  className="absolute top-6 right-6 w-12 h-12 opacity-10" 
                  style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)' }} 
                />
                
                <p className="font-body text-lg italic leading-relaxed text-white mb-8" style={{ flexGrow: 1 }}>
                  "{test.quote}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-full border border-white border-opacity-10 bg-black bg-opacity-30" 
                  ></div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-white text-sm">{test.author}</span>
                    <span className="font-body text-xs text-muted" style={{ color: 'var(--text-muted)' }}>{test.company}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
