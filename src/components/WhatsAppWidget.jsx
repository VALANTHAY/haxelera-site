import React from 'react';

export default function WhatsAppWidget() {
  const whatsappNumber = "+18097895432"; 
  const message = "Hola Haxelera Group, me gustaría conocer más sobre sus servicios.";
  const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 rounded-full group cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl"
      style={{
        background: 'hsla(140, 25%, 35%, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid hsla(140, 40%, 60%, 0.4)',
        boxShadow: '0 8px 32px 0 hsla(140, 30%, 20%, 0.5), 0 0 15px 0 hsla(140, 30%, 40%, 0.3)'
      }}
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-black bg-opacity-80 backdrop-blur-md px-4 py-2 rounded-lg border border-white border-opacity-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <p className="font-heading font-medium text-white text-sm">Chatea con nosotros</p>
      </div>

      <svg 
        viewBox="0 0 24 24" 
        width="28" 
        height="28" 
        stroke="white" 
        strokeWidth="1.5" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-white"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    </a>
  );
}
