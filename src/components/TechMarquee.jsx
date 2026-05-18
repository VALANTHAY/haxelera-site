import React from 'react';

export default function TechMarquee() {
  const techs = [
    "AWS", "Supabase", "React", "Node.js", "Python", 
    "Cloudflare", "Swift", "Zero-Trust", "Docker", 
    "Kubernetes", "TypeScript", "PostgreSQL"
  ];

  // We duplicate the array to create a seamless infinite loop
  const marqueeItems = [...techs, ...techs];

  return (
    <div className="w-full overflow-hidden border-y border-white border-opacity-5 py-4 bg-black bg-opacity-20 backdrop-blur-sm" style={{ borderTop: '1px solid hsla(0,0%,100%,0.05)', borderBottom: '1px solid hsla(0,0%,100%,0.05)', backgroundColor: 'hsla(0,0%,0%,0.2)' }}>
      <div className="flex w-[200%] animate-marquee" style={{ display: 'flex', width: '200%', animation: 'marquee 25s linear infinite' }}>
        {marqueeItems.map((tech, index) => (
          <div 
            key={index} 
            className="flex-1 text-center font-heading font-semibold text-sm uppercase tracking-widest"
            style={{ 
              color: 'var(--text-muted)', 
              opacity: 0.6,
              minWidth: '150px' 
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>
  );
}
