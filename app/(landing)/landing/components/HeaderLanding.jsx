'use client';
import { useRef, useEffect, useState } from 'react';

export default function HeaderLanding() {
  const [shrink, setShrink] = useState(false);
  const sentinelRef         = useRef(null);

  useEffect(() => {
    // Observa si el sentinel está visible justo debajo del header
    const observer = new IntersectionObserver(
      ([entry]) => setShrink(!entry.isIntersecting), // shrink ⇢ sentinel fuera de vista
      { rootMargin: '-1px 0px 0px 0px', threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className={shrink ? 'header shrink' : 'header'}>
        <img src="/LogoWhite.png" alt="Logo Balanced+" className="logo" />
      </header>

      {/* 1 px invisible justo después del header */}
      <div ref={sentinelRef} className="sentinel" />
    </>
  );
}