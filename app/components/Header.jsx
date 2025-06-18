"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={shrink ? "shrink" : ""}>
      <img src="/LogoWhite.png" alt="Logo Balanced+" />
    </header>
  );
}
