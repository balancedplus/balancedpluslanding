// app/(main)/cookies/page.js

export const metadata = {
  title: "Política de Cookies",
  description: "Política de Cookies de Balanced+"
};

export default function CookiesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 md:px-8">
      <h1 className="text-4xl font-thin mb-8 text-center" style={{ color: 'rgb(173, 173, 174)' }}>
        Política de Cookies
      </h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
        
        <section>
          <h2 className="text-xl font-medium mb-4">1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet, smartphone) 
            cuando visitas un sitio web. Las cookies permiten que el sitio web recuerde tus acciones y preferencias 
            durante un período de tiempo, por lo que no tienes que volver a configurarlas cada vez que regreses al 
            sitio o navegues de una página a otra.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. ¿Qué cookies utilizamos?</h2>
          
          <h3 className="font-medium mt-4 mb-2">2.1. Cookies estrictamente necesarias (técnicas)</h3>
          <p className="mb-2">
            Estas cookies son esenciales para que puedas navegar por el sitio web y utilizar sus funciones. 
            Sin estas cookies, los servicios que has solicitado no se pueden proporcionar.
          </p>
          <div className="ml-4 space-y-3 mt-3">
            <div className="border-l-2 pl-4" style={{ borderColor: '#cbc8bf' }}>
              <p className="font-medium">Firebase Authentication</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                <li><strong>Finalidad:</strong> Mantener tu sesión iniciada</li>
                <li><strong>Duración:</strong> Sesión / Hasta que cierres sesión</li>
                <li><strong>Proveedor:</strong> Google Firebase</li>
                <li><strong>Tipo:</strong> Primera parte</li>
              </ul>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: '#cbc8bf' }}>
              <p className="font-medium">Cookies de sesión</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                <li><strong>Finalidad:</strong> Gestionar el carrito de reservas y preferencias temporales</li>
                <li><strong>Duración:</strong> Sesión</li>
                <li><strong>Proveedor:</strong> Balanced+</li>
                <li><strong>Tipo:</strong> Primera parte</li>
              </ul>
            </div>
          </div>

          <h3 className="font-medium mt-6 mb-2">2.2. Cookies analíticas</h3>
          <p className="mb-2">
            Estas cookies nos permiten analizar cómo los usuarios utilizan el sitio web y controlar su rendimiento. 
            Esto nos ayuda a mejorar la forma en que funciona el sitio web, por ejemplo, asegurando que los usuarios 
            encuentren fácilmente lo que buscan.
          </p>
          <div className="ml-4 space-y-3 mt-3">
            <div className="border-l-2 pl-4" style={{ borderColor: '#cbc8bf' }}>
              <p className="font-medium">Google Analytics (GA4)</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                <li><strong>Finalidad:</strong> Medir el tráfico web, comportamiento de usuarios, páginas más visitadas</li>
                <li><strong>Duración:</strong> Hasta 24 meses</li>
                <li><strong>Proveedor:</strong> Google LLC</li>
                <li><strong>Tipo:</strong> Terceros</li>
                <li><strong>ID de medición:</strong> G-MMYKX2GMKF</li>
                <li><strong>Más información:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Política de Google</a></li>
              </ul>
            </div>
          </div>

          <h3 className="font-medium mt-6 mb-2">2.3. Cookies de terceros</h3>
          <div className="ml-4 space-y-3 mt-3">
            <div className="border-l-2 pl-4" style={{ borderColor: '#cbc8bf' }}>
              <p className="font-medium">Stripe (procesamiento de pagos)</p>
              <ul className="list-disc list-inside space-y-1 mt-1 text-xs">
                <li><strong>Finalidad:</strong> Procesar pagos de forma segura y detectar fraudes</li>
                <li><strong>Duración:</strong> Varía según el tipo de cookie</li>
                <li><strong>Proveedor:</strong> Stripe, Inc.</li>
                <li><strong>Más información:</strong> <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="underline">Política de Stripe</a></li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. ¿Cómo gestionar las cookies?</h2>
          
          <h3 className="font-medium mt-4 mb-2">3.1. Configuración del navegador</h3>
          <p className="mb-2">
            Puedes configurar tu navegador para que rechace todas las cookies o para que te avise cuando se envíe una 
            cookie. Sin embargo, ten en cuenta que si rechazas las cookies, es posible que no puedas utilizar todas 
            las funciones de nuestro sitio web.
          </p>
          <p className="mb-2 font-medium">Instrucciones por navegador:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/HT201265" target="_blank" rel="noopener noreferrer" className="underline">Safari (macOS)</a></li>
            <li><a href="https://support.apple.com/es-es/HT201265" target="_blank" rel="noopener noreferrer" className="underline">Safari (iOS)</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="underline">Microsoft Edge</a></li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">3.2. Herramientas de Google Analytics</h3>
          <p>
            Google ofrece un complemento de inhabilitación para navegadores:{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline">
              Complemento de inhabilitación de Google Analytics
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Cookies de redes sociales</h2>
          <p>
            Actualmente no utilizamos cookies de redes sociales (Facebook, Instagram, etc.) en nuestro sitio web. 
            Si en el futuro las incorporamos, actualizaremos esta política y te informaremos adecuadamente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">5. Consentimiento</h2>
          <p className="mb-2">
            Al utilizar nuestro sitio web, aceptas el uso de cookies de acuerdo con esta Política de Cookies.
          </p>
          <p>
            Las cookies estrictamente necesarias se instalan automáticamente porque son esenciales para el funcionamiento 
            del sitio. Para las cookies analíticas, te solicitamos tu consentimiento mediante un banner informativo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">6. Actualizaciones</h2>
          <p>
            Esta Política de Cookies puede actualizarse periódicamente para reflejar cambios en las cookies que utilizamos 
            o por otras razones operativas, legales o reglamentarias. Te recomendamos revisar esta página regularmente 
            para estar informado sobre nuestro uso de cookies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">7. Más información</h2>
          <p>
            Si tienes dudas sobre nuestra Política de Cookies, puedes contactarnos en:{' '}
            <a href="mailto:info@balancedplus.es" className="underline">info@balancedplus.es</a>
          </p>
        </section>

        <p className="text-xs opacity-75 mt-12">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}