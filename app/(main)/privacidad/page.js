// app/(main)/privacidad/page.js

export const metadata = {
  title: "Política de Privacidad",
  description: "Política de Privacidad y Protección de Datos de Balanced+"
};

export default function PrivacidadPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 md:px-8">
      <h1 className="text-4xl font-thin mb-8 text-center" style={{ color: 'rgb(173, 173, 174)' }}>
        Política de Privacidad
      </h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
        
        <section>
          <h2 className="text-xl font-medium mb-4">1. Responsable del tratamiento</h2>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Identidad:</strong> OCEANS WELLNESS, S.L.</li>
            <li><strong>Correo electrónico:</strong> info@balancedplus.es</li>
            <li><strong>Teléfono:</strong> +34 678 52 81 65</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Datos que recogemos</h2>
          <p className="mb-2">Recopilamos y tratamos las siguientes categorías de datos personales:</p>
          
          <h3 className="font-medium mt-4 mb-2">2.1. Datos de registro y perfil</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Nombre y apellidos</li>
            <li>Correo electrónico</li>
            <li>Teléfono</li>
            <li>Fecha de nacimiento (para verificar mayoría de edad o consentimiento parental)</li>
            <li>Código postal</li>
            <li>Género</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">2.2. Datos de uso del servicio</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Historial de reservas de clases</li>
            <li>Tipo de suscripción contratada</li>
            <li>Créditos de clases disponibles</li>
            <li>Preferencias de horarios y disciplinas</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">2.3. Datos de pago</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Información de tarjeta de crédito/débito (procesada por Stripe, no almacenamos datos completos)</li>
            <li>Historial de transacciones</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">2.4. Datos de navegación</h3>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Dirección IP</li>
            <li>Tipo de navegador</li>
            <li>Páginas visitadas</li>
            <li>Tiempo de navegación (mediante Google Analytics)</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">2.5. Datos de salud (opcional)</h3>
          <p className="ml-4 mt-2">
            Nuestros instructores pueden solicitar información sobre tu estado físico y condiciones médicas relevantes 
            para adaptar las clases. Esta información se recoge verbalmente y se anota en tu perfil solo si es 
            necesario para tu seguridad.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Finalidad del tratamiento</h2>
          <p className="mb-2">Utilizamos tus datos personales para:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Gestión del servicio:</strong> Procesar reservas, gestionar suscripciones y créditos de clases</li>
            <li><strong>Facturación y pagos:</strong> Emitir facturas y procesar pagos de forma segura</li>
            <li><strong>Comunicaciones:</strong> Enviar confirmaciones de reserva, recordatorios, cambios de horarios</li>
            <li><strong>Marketing (con tu consentimiento):</strong> Enviar newsletters, promociones y novedades sobre nuestros servicios</li>
            <li><strong>Mejora del servicio:</strong> Analizar el uso de la plataforma para mejorar la experiencia de usuario</li>
            <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales (contabilidad, fiscal, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Base legal del tratamiento</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Ejecución del contrato:</strong> El tratamiento es necesario para prestarte el servicio contratado</li>
            <li><strong>Consentimiento:</strong> Para comunicaciones comerciales y cookies no esenciales</li>
            <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes</li>
            <li><strong>Obligación legal:</strong> Para cumplir con obligaciones contables y fiscales</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">5. Destinatarios de los datos</h2>
          <p className="mb-2">Tus datos pueden ser compartidos con los siguientes terceros:</p>
          
          <h3 className="font-medium mt-4 mb-2">Proveedores de servicios esenciales:</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Firebase (Google LLC):</strong> Autenticación de usuarios y almacenamiento de datos</li>
            <li><strong>Stripe:</strong> Procesamiento de pagos</li>
            <li><strong>Brevo:</strong> Envío de emails transaccionales y marketing</li>
            <li><strong>Google Analytics:</strong> Análisis de uso de la web (ID: G-MMYKX2GMKF)</li>
          </ul>

          <p className="mt-4">
            Todos estos proveedores están ubicados en países con nivel adecuado de protección de datos o 
            cuentan con las garantías apropiadas (cláusulas contractuales tipo UE).
          </p>

          <h3 className="font-medium mt-4 mb-2">Autoridades y organismos públicos:</h3>
          <p className="ml-4">
            Cuando sea necesario por obligación legal (Hacienda, Seguridad Social, Juzgados, etc.)
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">6. Transferencias internacionales</h2>
          <p>
            Algunos de nuestros proveedores (Firebase, Stripe, Google Analytics, Brevo) transfieren datos fuera del 
            Espacio Económico Europeo. Estas transferencias se realizan con las garantías apropiadas:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Cláusulas Contractuales Tipo de la Comisión Europea</li>
            <li>Decisiones de adecuación de la Comisión Europea</li>
            <li>Certificaciones de cumplimiento (Privacy Shield sucesor, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">7. Conservación de los datos</h2>
          <p className="mb-2">Conservamos tus datos personales:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Durante la relación contractual:</strong> Mientras mantengas una cuenta activa</li>
            <li><strong>Usuarios inactivos:</strong> Los datos se conservan durante 2 años desde la última actividad</li>
            <li><strong>Datos fiscales y contables:</strong> Se conservan durante el plazo legal mínimo de 6 años</li>
            <li><strong>Marketing:</strong> Hasta que retires tu consentimiento</li>
          </ul>
          <p className="mt-2">
            Transcurridos estos plazos, procederemos a la supresión o anonimización de tus datos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">8. Tus derechos</h2>
          <p className="mb-2">Tienes derecho a:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Acceso:</strong> Saber qué datos tenemos sobre ti</li>
            <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos ("derecho al olvido")</li>
            <li><strong>Limitación:</strong> Solicitar que limitemos el tratamiento de tus datos</li>
            <li><strong>Portabilidad:</strong> Recibir tus datos en formato estructurado y legible</li>
            <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos</li>
            <li><strong>No ser objeto de decisiones automatizadas:</strong> No usar exclusivamente tratamientos automatizados</li>
            <li><strong>Retirar el consentimiento:</strong> En cualquier momento, para comunicaciones comerciales</li>
          </ul>

          <p className="mt-4 mb-2"><strong>¿Cómo ejercer tus derechos?</strong></p>
          <p className="ml-4">
            Enviando un correo electrónico a <strong>info@balancedplus.es</strong> indicando:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Tu nombre completo y correo electrónico asociado a tu cuenta</li>
            <li>Derecho que deseas ejercer</li>
            <li>Copia de tu DNI o documento identificativo</li>
          </ul>

          <p className="mt-4">
            Responderemos a tu solicitud en el plazo de 1 mes desde la recepción.
          </p>

          <p className="mt-4">
            <strong>Derecho a reclamar:</strong> Si consideras que no hemos atendido correctamente tus derechos, 
            puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">9. Seguridad</h2>
          <p>
            Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de tus datos 
            personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta el 
            estado de la tecnología, la naturaleza de los datos y los riesgos a los que están expuestos.
          </p>
          <p className="mt-2">Algunas de estas medidas incluyen:</p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Cifrado SSL/TLS en todas las comunicaciones</li>
            <li>Autenticación segura mediante Firebase</li>
            <li>Tokenización de datos de pago mediante Stripe</li>
            <li>Acceso restringido a datos personales solo a personal autorizado</li>
            <li>Copias de seguridad regulares</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">10. Menores de edad</h2>
          <p>
            Nuestros servicios están disponibles para mayores de 18 años. Los menores de edad pueden acceder con el 
            consentimiento expreso de sus padres o tutores legales, quienes serán responsables de gestionar la cuenta 
            y aceptar estas condiciones en nombre del menor.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">11. Cookies</h2>
          <p>
            Este sitio web utiliza cookies propias y de terceros. Para más información, consulta nuestra{' '}
            <a href="/cookies" className="underline hover:opacity-70">Política de Cookies</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">12. Modificaciones</h2>
          <p>
            OCEANS WELLNESS, S.L. se reserva el derecho a modificar la presente Política de Privacidad para adaptarla 
            a novedades legislativas o jurisprudenciales. En tal caso, se anunciará en esta página con antelación 
            suficiente a su puesta en práctica.
          </p>
        </section>

        <p className="text-xs opacity-75 mt-12">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}