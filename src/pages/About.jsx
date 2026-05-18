import React from 'react';
import { Award, Users, Target, Globe, TrendingUp, Heart } from 'lucide-react';

const teamMembers = [
  { name: 'Maxwell Valanthay Martinez', role: 'CEO & Co-Fundador', bio: 'Más de 8 años transformando empresas con tecnología disruptiva.' },
  { name: 'María González', role: 'CTO & Arquitecta de Nube', bio: 'Especialista certificada en Azure y AWS con certificaciones Gold.' },
  { name: 'Andrés Pérez', role: 'Director de Ciberseguridad', bio: 'Ethical Hacker certificado OSCP, ex-consultor de organismos regulatorios.' },
  { name: 'Luisa Herrera', role: 'Directora de Innovación', bio: 'PhD en Inteligencia Artificial aplicada a procesos empresariales.' },
];

const milestones = [
  { year: '2015', title: 'Fundación', desc: 'Haxelera Group nace con la misión de democratizar la transformación digital en América Latina.' },
  { year: '2017', title: 'Expansión USA', desc: 'Apertura de nuestra sede en Doral, Florida para atender el mercado hispano de Norteamérica.' },
  { year: '2019', title: 'Partner Gold Microsoft', desc: 'Certificación como Microsoft Gold Partner en Cloud & Data Platform.' },
  { year: '2021', title: 'Expansión Guatemala', desc: 'Inauguración de oficinas en Zona 10 para ampliar la cobertura centroamericana.' },
  { year: '2023', title: '+500 Proyectos', desc: 'Superamos los 500 proyectos entregados con un 99% de tasa de satisfacción.' },
];

export default function About() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="relative py-24 text-center" style={{ background: 'linear-gradient(135deg, hsla(135,25%,55%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '24px' }}>NUESTRA EMPRESA</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '24px' }}>
            Más de <span className="gradient-text-sage">10 Años</span> Impulsando la <span className="gradient-text-copper">Transformación Digital</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Somos una empresa de tecnología multinacional con presencia en República Dominicana, Estados Unidos y Guatemala, especializada en soluciones de software, nube y ciberseguridad.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="section-container">
          <h2 className="font-heading font-bold text-white text-center mb-16" style={{ fontSize: '2rem', marginBottom: '64px' }}>
            Nuestros <span className="gradient-text-dual">Valores</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: Target, title: 'Misión', text: 'Ofrecer soluciones tecnológicas innovadoras que impulsen el crecimiento y la competitividad de nuestros clientes.', color: 'var(--primary)' },
              { icon: Globe, title: 'Visión', text: 'Ser el socio tecnológico de referencia en América Latina, reconocidos por nuestra excelencia e innovación.', color: 'var(--accent)' },
              { icon: Heart, title: 'Valores', text: 'Integridad, Innovación, Colaboración y Compromiso con el éxito de cada cliente y cada proyecto.', color: 'var(--primary)' },
            ].map((v, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '40px 28px' }}>
                <v.icon style={{ width: '40px', height: '40px', color: v.color, margin: '0 auto 20px' }} />
                <h3 className="font-heading font-bold text-white mb-3" style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ background: 'hsla(0,0%,100%,0.01)' }}>
        <div className="section-container">
          <h2 className="font-heading font-bold text-white text-center mb-16" style={{ fontSize: '2rem', marginBottom: '64px' }}>
            Nuestra <span className="gradient-text-sage">Historia</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '80px', textAlign: 'right' }}>
                  <span className="font-heading font-extrabold" style={{ color: 'var(--primary)', fontSize: '1rem' }}>{m.year}</span>
                </div>
                <div style={{ width: '2px', background: 'var(--primary)', opacity: 0.3, position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', position: 'absolute', top: '4px', left: '-5px' }}></div>
                </div>
                <div className="glass-card" style={{ flex: 1, padding: '20px 24px' }}>
                  <h4 className="font-heading font-bold text-white mb-2" style={{ marginBottom: '8px' }}>{m.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="section-container">
          <h2 className="font-heading font-bold text-white text-center mb-16" style={{ fontSize: '2rem', marginBottom: '64px' }}>
            Nuestro <span className="gradient-text-copper">Equipo</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {teamMembers.map((m, i) => (
              <div key={i} className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users style={{ width: '32px', height: '32px', color: 'white' }} />
                </div>
                <h4 className="font-heading font-bold text-white" style={{ marginBottom: '4px' }}>{m.name}</h4>
                <p style={{ color: 'var(--accent)', fontSize: '0.8rem', marginBottom: '12px', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>{m.role}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20" style={{ background: 'hsla(0,0%,100%,0.01)' }}>
        <div className="section-container" style={{ textAlign: 'center' }}>
          <Award style={{ width: '48px', height: '48px', color: 'var(--accent)', margin: '0 auto 24px' }} />
          <h2 className="font-heading font-bold text-white mb-6" style={{ fontSize: '2rem', marginBottom: '16px' }}>
            2x <span className="gradient-text-copper">Tech Partner del Año</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.8 }}>
            Haxelera Group ha sido reconocida dos veces como el Partner Tecnológico del Año por nuestro nivel de excelencia, innovación y compromiso con nuestros clientes en la región de América Latina.
          </p>
        </div>
      </section>
    </main>
  );
}
