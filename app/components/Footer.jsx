"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[rgb(244,244,244)] border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-4 text-[rgb(173,173,174)] text-sm">
        
        {/* Contacto */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            {/* Enlace directo a WhatsApp */}
            <a 
              href="https://wa.me/34678528165" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src="/whatsapp_icon.png" alt="WhatsApp" className="w-5 h-5" />
              <span>+34 678 52 81 65</span>
            </a>
          </div>
          <p>✉️ info@balancedplus.es</p>
        </div>

      </div>
    </footer>
  );
}
