import React from 'react';
import { Database, Brain, BarChart3, Layers, CheckCircle, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Database,
    title: 'Data Engineering',
    subtitle: 'Arquitectura de Datos',
    desc: 'Diseñamos, construimos y mantenemos los pipelines y plataformas de datos que permiten a las organizaciones acceder, procesar y analizar información de manera confiable y escalable.',
    features: ['Data Warehousing (Azure Synapse, Snowflake)', 'Pipelines ETL/ELT modernos (Databricks, dbt)', 'Data Lakes y Data Mesh Architecture', 'Integración de fuentes de datos heterogéneas', 'Gobierno de datos y calidad (Data Quality)'],
    accent: 'sage',
  },
  {
    icon: Brain,
    title: 'Inteligencia Artificial & ML',
    subtitle: 'Modelos Predictivos & Generativos',
    desc: 'Desarrollamos e implementamos modelos de Machine Learning e Inteligencia Artificial para resolver problemas concretos de negocio: predicción de demanda, detección de fraude, segmentación de clientes, etc.',
    features: ['Modelos predictivos y clasificación (Python, Azure ML)', 'IA Generativa y LLMs para automatización', 'Computer Vision y procesamiento de imágenes', 'NLP y análisis de sentimientos', 'MLOps: despliegue y monitoreo de modelos en producción'],
    accent: 'copper',
  },
  {
    icon: BarChart3,
    title: 'Business Intelligence',
    subtitle: 'Reportes & Dashboards',
    desc: 'Transformamos datos crudos en reportes y dashboards visuales que permiten a los líderes tomar decisiones basadas en datos en tiempo real, integrando múltiples fuentes de información.',
    features: ['Power BI, Tableau y Looker Studio', 'KPIs y métricas de negocio personalizadas', 'Reportes automatizados y programados', 'Alertas inteligentes basadas en umbrales', 'Integración con sistemas ERP y CRM'],
    accent: 'sage',
  },
  {
    icon: Layers,
    title: 'Plataforma de Datos en la Nube',
    subtitle: 'Modern Data Stack',
    desc: 'Implementamos el "Modern Data Stack" completo: desde la ingestión hasta el consumo, usando las mejores herramientas del mercado para construir una plataforma de datos resiliente y mantenible.',
    features: ['Azure Data Factory / AWS Glue', 'Almacenamiento escalable (Parquet, Delta Lake)', 'Orquestación de workflows (Apache Airflow)', 'Catálogo de datos y linaje (Purview, DataHub)', 'Seguridad de datos y enmascaramiento (PII)'],
    accent: 'copper',
  },
];

export default function DataAI() {
  return (
    <main style={{ paddingTop: '80px' }}>
      <section className="relative py-24 text-center" style={{ background: 'linear-gradient(135deg, hsla(135,25%,55%,0.05) 0%, transparent 60%)' }}>
        <div className="section-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '24px' }}>DATA & INTELIGENCIA ARTIFICIAL</div>
          <h1 className="section-title font-heading font-bold text-white" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', marginBottom: '24px' }}>
            Convierte tus <span className="gradient-text-sage">Datos</span> en tu Mayor <span className="gradient-text-copper">Ventaja Competitiva</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 48px', lineHeight: 1.8 }}>
            Ofrecemos información práctica de valor para transformar su empresa. Procesamos, analizamos y aseguramos sus datos para permitirle tomar decisiones precisas y acertadas mediante Inteligencia Artificial.
          </p>
          <a href="/contacto" className="btn-primary" style={{ display: 'inline-flex' }}>
            Consultar con Expertos <ArrowRight style={{ width: '16px', height: '16px' }} />
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="section-container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {services.map((s, i) => {
            const isCopper = s.accent === 'copper';
            return (
              <div key={i} className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', padding: '48px' }}>
                <div>
                  <s.icon style={{ width: '40px', height: '40px', color: isCopper ? 'var(--accent)' : 'var(--primary)', marginBottom: '20px' }} />
                  <p style={{ color: isCopper ? 'var(--accent)' : 'var(--primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{s.subtitle}</p>
                  <h2 className="font-heading font-bold text-white" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>{s.title}</h2>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>{s.desc}</p>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white" style={{ marginBottom: '20px', fontSize: '1rem' }}>Incluye:</h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', listStyle: 'none', padding: 0 }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0, color: isCopper ? 'var(--accent)' : 'var(--primary)' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/contacto" className={isCopper ? 'btn-accent' : 'btn-primary'} style={{ display: 'inline-flex', marginTop: '28px', fontSize: '0.875rem' }}>
                    Hablar con un Científico de Datos <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
