// app/(main)/aviso-legal/page.js

export const metadata = {
  title: "Aviso Legal",
  description: "Aviso legal de Balanced+ - OCEANS WELLNESS, S.L."
};

export default function AvisoLegalPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 md:px-8">
      <h1 className="text-4xl font-thin mb-8 text-center" style={{ color: 'rgb(173, 173, 174)' }}>
        Aviso Legal
      </h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
        
        <section>
          <h2 className="text-xl font-medium mb-4">1. Datos identificativos</h2>
          <p className="mb-2">
            En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, 
            de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan 
            los siguientes datos:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Titular:</strong> OCEANS WELLNESS, S.L.</li>
            <li><strong>Nombre comercial:</strong> Balanced+</li>
            <li><strong>Correo electrónico:</strong> info@balancedplus.es</li>
            <li><strong>Teléfono:</strong> +34 678 52 81 65</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Objeto</h2>
          <p>
            El presente aviso legal regula el uso del sitio web balancedplus.es (en adelante, LA WEB), del que es 
            titular OCEANS WELLNESS, S.L.
          </p>
          <p className="mt-2">
            La navegación por LA WEB atribuye la condición de usuario del mismo e implica la aceptación plena y sin 
            reservas de todas y cada una de las disposiciones incluidas en este Aviso Legal, que pueden sufrir 
            modificaciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Servicios</h2>
          <p>
            A través de LA WEB, OCEANS WELLNESS, S.L. facilita a los usuarios el acceso y la utilización de diversos 
            servicios relacionados con clases de pilates reformer, yoga, entrenamiento funcional y barre, incluyendo:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Información sobre horarios y tarifas</li>
            <li>Sistema de reserva de clases online</li>
            <li>Gestión de suscripciones y pagos</li>
            <li>Acceso a área de usuario personal</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Responsabilidad</h2>
          <p className="mb-2">
            OCEANS WELLNESS, S.L. no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier 
            naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de 
            disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, 
            a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">5. Propiedad intelectual e industrial</h2>
          <p className="mb-2">
            Todos los contenidos de este sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, 
            tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad 
            pertenece a OCEANS WELLNESS, S.L., sin que puedan entenderse cedidos al usuario ninguno de los derechos 
            de explotación sobre los mismos más allá de lo estrictamente necesario para el correcto uso de la web.
          </p>
          <p>
            En definitiva, los usuarios que accedan a este sitio web pueden visualizar los contenidos y efectuar, 
            en su caso, copias privadas autorizadas siempre que los elementos reproducidos no sean cedidos 
            posteriormente a terceros, ni se instalen a servidores conectados a redes, ni sean objeto de ningún 
            tipo de explotación.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">6. Protección de datos</h2>
          <p>
            Para utilizar algunos de los servicios, el usuario debe proporcionar previamente ciertos datos de carácter 
            personal. OCEANS WELLNESS, S.L. tratará automatizadamente estos datos, con la finalidad y en los términos 
            que se indican en la Política de Privacidad, a la cual puede acceder en todo momento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">7. Legislación aplicable y jurisdicción</h2>
          <p>
            La relación entre OCEANS WELLNESS, S.L. y el USUARIO se regirá por la normativa española vigente y 
            cualquier controversia se someterá a los Juzgados y Tribunales de la ciudad de Valencia.
          </p>
        </section>

        <p className="text-xs opacity-75 mt-12">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}