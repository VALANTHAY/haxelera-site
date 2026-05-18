import React from 'react';
import { BookOpen, Shield, Terminal, Brain, Clock, Star, ArrowRight, CheckCircle } from 'lucide-react';

const courses = [
  {
    icon: Shield,
    title: 'Ciberseguridad Ofensiva',
    level: 'Intermedio - Avanzado',
    duration: '60 horas',
    modality: 'Virtual & Presencial',
    price: 'USD $450',
    desc: 'Aprende las técnicas más avanzadas de Ethical Hacking: reconocimiento, explotación, post-explotación y reporte. Prepárate para certificaciones como CEH, OSCP y eJPT.',
    topics: ['Reconocimiento y OSINT avanzado', 'Explotación de vulnerabilidades web (XSS, SQLi)', 'Post-explotación y movimiento lateral', 'Análisis de malware y forense digital', 'Laboratorios prácticos en entornos reales'],
    accent: 'copper',
  },
  {
    icon: Terminal,
    title: 'DevOps & Cloud Engineering',
    level: 'Básico - Intermedio',
    duration: '48 horas',
    modality: 'Virtual',
    price: 'USD $350',
    desc: 'Domina las herramientas y prácticas que todo ingeniero moderno necesita: Docker, Kubernetes, Terraform, pipelines CI/CD y despliegue en la nube.',
    topics: ['Linux avanzado y scripting Bash/Python', 'Contenedores con Docker y orquestación K8s', 'Infraestructura como código con Terraform', 'CI/CD con GitHub Actions y Azure DevOps', 'Despliegue en Azure / AWS'],
    accent: 'sage',
  },
  {
    icon: Brain,
    title: 'Data Science & Machine Learning',
    level: 'Intermedio',
    duration: '72 horas',
    modality: 'Virtual',
    price: 'USD $500',
    desc: 'Aprende a construir modelos predictivos y de clasificación desde cero. Domina Python, pandas, scikit-learn y despliega tus modelos en producción en la nube.',
    topics: ['Python para análisis de datos (pandas, numpy)', 'Modelos supervisados y no supervisados', 'Redes neuronales y Deep Learning (TensorFlow)', 'IA Generativa y LangChain / LlamaIndex', 'MLOps: despliegue y monitoreo de modelos'],
    accent: 'copper',
  },
  {
    icon: BookOpen,
    title: 'Desarrollo Web Full-Stack',
    level: 'Básico - Avanzado',
    duration: '80 horas',
    modality: 'Virtual & Presencial',
    price: 'USD $400',
    desc: 'Desde cero hasta profesional. Aprende a construir aplicaciones web modernas con React en el frontend, Node.js en el backend y desplegarlas en la nube.',
    topics: ['HTML, CSS y JavaScript moderno (ES6+)', 'React.js con hooks y contexto', 'Node.js + Express + APIs REST', 'Bases de datos SQL y NoSQL', 'Despliegue en AWS / Vercel / Netlify'],
    accent: 'sage',
  },
];

export default function Courses() {
  return (
    <main style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section className="relative py-24 text-center" style={{ background: 'linear-gradient(135deg, hsla(30,45%,45%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <div className="section-tag section-tag-copper" style={{ display: 'inline-flex', marginBottom: '24px' }}>FORMACIÓN TECNOLÓGICA</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '24px' }}>
            Cursos de <span className="gradient-text-copper">Tecnología</span> Impartidos por <span className="gradient-text-sage">Expertos</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Nuestros ingenieros y especialistas comparten su conocimiento práctico en formatos intensivos, diseñados para profesionales que quieren escalar rápido en el mundo tecnológico.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="section-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
          {courses.map((c, i) => {
            const isCopper = c.accent === 'copper';
            return (
              <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '36px', border: `1px solid ${isCopper ? 'hsla(30, 45%, 45%, 0.2)' : 'hsla(135, 25%, 55%, 0.2)'}` }}>
                <c.icon style={{ width: '36px', height: '36px', color: isCopper ? 'var(--accent)' : 'var(--primary)', marginBottom: '20px' }} />
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {[c.level, c.duration, c.modality].map((tag, ti) => (
                    <span key={ti} style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '0.7rem', fontFamily: 'var(--font-heading)', fontWeight: 600, background: 'hsla(0,0%,100%,0.04)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>{tag}</span>
                  ))}
                </div>

                <h3 className="font-heading font-bold text-white" style={{ fontSize: '1.3rem', marginBottom: '12px' }}>{c.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '20px', flex: 1 }}>{c.desc}</p>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, marginBottom: '28px' }}>
                  {c.topics.map((t, ti) => (
                    <li key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      <CheckCircle style={{ width: '14px', height: '14px', flexShrink: 0, marginTop: '2px', color: isCopper ? 'var(--accent)' : 'var(--primary)' }} />
                      {t}
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                  <span className="font-heading font-extrabold" style={{ fontSize: '1.4rem', color: isCopper ? 'var(--accent)' : 'var(--primary)' }}>{c.price}</span>
                  <a href="/contacto" className={isCopper ? 'btn-accent' : 'btn-primary'} style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'inline-flex' }}>
                    Inscribirme <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'hsla(0,0%,100%,0.01)' }}>
        <div className="section-container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          <Star style={{ width: '48px', height: '48px', color: 'var(--accent)', margin: '0 auto 24px' }} />
          <h2 className="font-heading font-bold text-white" style={{ fontSize: '2rem', marginBottom: '16px' }}>
            ¿Cursos para tu <span className="gradient-text-copper">Empresa</span>?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '32px' }}>
            Ofrecemos programas de capacitación corporativa personalizados para equipos de desarrollo, operaciones y seguridad. Contáctanos para diseñar el programa ideal para tu organización.
          </p>
          <a href="/contacto" className="btn-accent" style={{ display: 'inline-flex' }}>
            Solicitar Programa Corporativo <ArrowRight style={{ width: '16px', height: '16px' }} />
          </a>
        </div>
      </section>
    </main>
  );
}
