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
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#25D366',
        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4), 0 4px 12px rgba(0,0,0,0.3)',
        border: 'none',
        textDecoration: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.12)';
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(37, 211, 102, 0.5), 0 6px 16px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.4), 0 4px 12px rgba(0,0,0,0.3)';
      }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 175.216 175.552"
        width="32" 
        height="32"
      >
        <defs>
          <linearGradient id="wa-grad" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#57d163"/>
            <stop offset="1" stopColor="#23b33a"/>
          </linearGradient>
        </defs>
        <path fill="#fff" d="M87.184 14.2A73.073 73.073 0 0 0 17.91 96.887c0 12.862 3.356 25.42 9.734 36.508L14.2 175.552l43.27-11.352a73.2 73.2 0 0 0 34.972 8.92h.03A73.073 73.073 0 0 0 87.184 14.2zm0 133.768h-.025a60.67 60.67 0 0 1-30.93-8.479l-2.22-1.317-22.98 6.028 6.132-22.424-1.445-2.3A60.67 60.67 0 0 1 87.184 26.6a60.76 60.76 0 0 1 0 121.37zm33.37-45.465c-1.83-.914-10.82-5.34-12.5-5.948-1.68-.614-2.9-.914-4.12.914s-4.73 5.948-5.8 7.17c-1.065 1.22-2.13.915-3.96 0-1.83-.914-7.72-2.846-14.71-9.074-5.437-4.843-9.11-10.822-10.18-12.652-1.066-1.83-.114-2.82.8-3.733.823-.82 1.83-2.137 2.745-3.204.914-1.067 1.22-1.83 1.83-3.052.61-1.22.305-2.288-.153-3.204-.457-.914-4.12-9.93-5.646-13.594-1.486-3.565-2.998-3.083-4.12-3.14-1.067-.053-2.288-.064-3.508-.064a6.718 6.718 0 0 0-4.882 2.288c-1.678 1.83-6.41 6.256-6.41 15.27 0 9.014 6.562 17.724 7.478 18.94.914 1.22 12.92 19.72 31.31 27.66 4.372 1.886 7.783 3.013 10.445 3.858 4.39 1.396 8.39 1.198 11.548.726 3.523-.525 10.82-4.424 12.35-8.7 1.525-4.276 1.525-7.937 1.066-8.7-.457-.762-1.678-1.22-3.508-2.134z"/>
      </svg>
    </a>
  );
}
