'use client';

import { useEffect, useState } from 'react';

export default function AltaSocioPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // Cargar el CSS primero
    const link = document.createElement('link');
    link.href = 'https://balanced-iframe.ismygym.com/iframe/iframe.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cargar el script del iframe
    const script = document.createElement('script');
    script.src = 'https://balanced-iframe.ismygym.com/iframe/iframe.min.js';
    script.async = true;
    
    script.onload = () => {
      setIframeLoaded(true);
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen">

      {/* Iframe de ismygym */}
      <div className="w-full" style={{ minHeight: '928px' }}>
        <iframe
          src="https://balanced-iframe.ismygym.com/centro-balanced+/alta?from="
          id="ism-iframe"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin allow-popups-to-escape-sandbox allow-top-navigation"
          allow="geolocation; payment"
          className="w-full border-0"
          style={{ 
            width: '100%',
            minHeight: '928px',
            display: iframeLoaded ? 'block' : 'none'
          }}
        />
        {!iframeLoaded && (
          <div className="w-full flex items-center justify-center" style={{ minHeight: '928px' }}>
            <p className="text-[rgb(173,173,174)]">Cargando formulario...</p>
          </div>
        )}
      </div>
    </div>
  );
}