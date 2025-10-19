import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthProvider from './components/AuthProvider'
import CookieBanner from './components/CookieBanner'
import { ToastProvider } from './components/ToastProvider'
import FreeTrialBanner from './components/FreeTrialBanner'
import SaturdayScheduleModal from './components/SaturdayScheduleModal'

export const metadata = {
  metadataBase: new URL('https://balancedplus.es'),
  title: {
    default: 'Balanced+ | Centro de Pilates Reformer, Barre, Entrenamiento Funcional y Yoga en Godella',
    template: '%s | Balanced+'
  },
  description: 'Centro de pilates reformer, barre, entrenamiento funcional y yoga en Godella y Campolivar. Clases reducidas con instructores certificados en un espacio amplio con luz natural.',
  keywords: ['pilates godella', 'pilates valencia', 'yoga godella', 'pilates reformer godella', 'pilates reformer valencia', 'entrenamiento funcional godella', 'barre godella', 'barre valencia', 'pilates campolivar', 'yoga campolivar', 'gimnasio godella', 'centro deportivo godella', 'clases pilates valencia'],
  authors: [{ name: 'Balanced+' }],
  creator: 'Balanced+',
  publisher: 'Balanced+',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://balancedplus.es',
    siteName: 'Balanced+',
    title: 'Balanced+ | Centro de Pilates Reformer, Barre, Entrenamiento Funcional y Yoga en Godella',
    description: 'Centro de pilates reformer, barre, entrenamiento funcional y yoga en Godella y Campolivar. Clases reducidas con instructores certificados.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Balanced+ Godella',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Balanced+ | Centro de Pilates Reformer, Barre, Entrenamiento Funcional y Yoga en Godella',
    description: 'Centro de pilates reformer, barre, entrenamiento funcional y yoga en Godella y Campolivar. Clases reducidas con instructores certificados.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>

        {/* Favicon para Google (512x512) - AÑADIR ESTO */}
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
        
        {/* Favicon estándar (32x32) - AÑADIR ESTO */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-96x96.png" />

        <link rel="icon" href="/monogramaiconblack.png" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/monogramaiconwhite.png" media="(prefers-color-scheme: dark)" />
        
        {/* Schema.org JSON-LD para LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "name": "Balanced+",
              "description": "Centro de pilates reformer, barre, entrenamiento funcional y y en Godella",
              "image": "https://balancedplus.es/og-image.png",
              "url": "https://balancedplus.es",
              "telephone": "+34678528165",
              "email": "info@balancedplus.es",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Avenida Acacias, 16",
                "addressLocality": "Godella",
                "addressRegion": "Valencia",
                "postalCode": "46110",
                "addressCountry": "ES"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "39.5274775",
                "longitude": "-0.4283139"
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                  ],
                  "opens": "07:00",
                  "closes": "21:00"
                }
              ],
              "priceRange": "€€",
              "areaServed": [
                "Godella",
                "Campolivar",
                "Valencia",
                "Rocafort",
                "Bétera",
                "Paterna",
                "Burjassot"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Balanced+",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Pilates Reformer",
                      "description": "Clases de pilates con máquinas reformer profesionales"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Yoga",
                      "description": "Clases de yoga para todos los niveles"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Entrenamiento Funcional",
                      "description": "Entrenamiento personalizado para mejorar fuerza y resistencia"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Barre",
                      "description": "Clases que combinan ballet, pilates y yoga"
                    }
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <FreeTrialBanner />
            <SaturdayScheduleModal />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <CookieBanner />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}