import React from 'react';
import { Compass, Eye, Shield, Award, Users, Heart } from 'lucide-react';

export default function DNA() {
  const values = [
    {
      icon: Shield,
      title: 'Seguridad Nativa',
      description: 'Creemos que la seguridad no es una capa superficial posterior, sino una disciplina fundamental que debe estructurarse desde la primera línea de diseño arquitectónico.'
    },
    {
      icon: Award,
      title: 'Excelencia Técnica',
      description: 'Priorizamos el código legible, modular y mantenible. Desarrollamos soluciones robustas utilizando las mejores prácticas globales de ingeniería de software.'
    },
    {
      icon: Heart,
      title: 'Resiliencia Natural',
      description: 'Nuestras aplicaciones se adaptan y recuperan de manera autónoma ante incidentes, garantizando la continuidad operativa y una experiencia de usuario fluida.'
    }
  ];

  return (
    <section id="nosotros" className="relative py-24" style={{ overflow: 'hidden' }}>
      {/* Shifting background glows */}
      <div className="ambient-light ambient-light-sage" style={{ bottom: '-10%', left: '10%' }}></div>

      <div className="section-container">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag">
            NUESTRO ADN
          </div>
          <h2 className="section-title font-heading font-bold text-white max-w-2xl">
            Misión, Visión & <span className="gradient-text-sage">Valores Fundacionales</span>
          </h2>
          <p className="section-subtitle">
            Haxelera Group nació con el firme propósito de redefinir la confianza digital, fusionando el arte de la ingeniería de software con la ciencia de la ciberseguridad corporativa.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          {/* Mission Card */}
          <div 
            className="glass-card flex flex-col items-start text-left"
            style={{ border: '1px solid hsla(135, 25%, 55%, 0.1)', padding: '40px' }}
          >
            <div className="p-3 rounded-xl border mb-6 flex items-center justify-center text-primary" style={{ backgroundColor: 'hsla(0,0%,100%,0.02)', borderColor: 'var(--glass-border)', color: 'var(--primary)', marginBottom: '24px' }}>
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-white">Nuestra Misión</h3>
            <p className="font-body text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              Empoderar a las organizaciones mediante el diseño y desarrollo de soluciones de software robustas de alto rendimiento, completamente integradas con perímetros de ciberseguridad impenetrables. Impulsamos la transformación digital con una filosofía de diseño fluida, natural y libre de fricciones operativas.
            </p>
          </div>

          {/* Vision Card */}
          <div 
            className="glass-card flex flex-col items-start text-left glass-card-copper"
            style={{ border: '1px solid hsla(30, 45%, 45%, 0.1)', padding: '40px' }}
          >
            <div className="p-3 rounded-xl border mb-6 flex items-center justify-center text-accent" style={{ backgroundColor: 'hsla(0,0%,100%,0.02)', borderColor: 'var(--glass-border)', color: 'var(--accent)', marginBottom: '24px' }}>
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-white">Nuestra Visión</h3>
            <p className="font-body text-muted leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.975rem' }}>
              Consolidarnos a nivel global como el referente indiscutible en ingeniería de software "secure-by-design" (seguro por diseño). Buscamos cerrar la brecha histórica entre el alto rendimiento tecnológico y la absoluta tranquilidad operativa, logrando que la protección digital sea un atributo nativo de cada desarrollo empresarial.
            </p>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h4 className="font-heading font-bold text-2xl mb-10 text-white tracking-wide" style={{ marginBottom: '40px' }}>
            Valores que Guían Nuestro Código
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', width: '100%' }}>
            {values.map((val, idx) => {
              const ValIcon = val.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white bg-opacity-5 p-6 rounded-xl border border-white border-opacity-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:bg-opacity-10"
                  style={{
                    background: 'hsla(0,0%,100%,0.02)',
                    border: '1px solid hsla(0,0%,100%,0.04)',
                    padding: '24px',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <div className="p-3 rounded-full mb-4 text-primary bg-white bg-opacity-5 flex items-center justify-center" style={{ color: 'var(--primary)', background: 'hsla(0,0%,100%,0.02)', marginBottom: '16px' }}>
                    <ValIcon className="w-6 h-6" />
                  </div>
                  <h5 className="font-heading font-bold text-lg mb-2 text-white">{val.title}</h5>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
