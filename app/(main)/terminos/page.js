// app/(main)/terminos/page.js

export const metadata = {
  title: "Términos y Condiciones",
  description: "Términos y Condiciones de uso de Balanced+"
};

export default function TerminosPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 md:px-8">
      <h1 className="text-4xl font-thin mb-8 text-center" style={{ color: 'rgb(173, 173, 174)' }}>
        Términos y Condiciones
      </h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: 'rgb(173, 173, 174)' }}>
        
        <section>
          <h2 className="text-xl font-medium mb-4">1. Información general</h2>
          <p className="mb-2">
            Los presentes Términos y Condiciones regulan el acceso y uso de los servicios ofrecidos por OCEANS WELLNESS, S.L. 
            (en adelante, "Balanced+") a través de su sitio web balancedplus.es y sus instalaciones físicas ubicadas en 
            Avenida Acacias, 16, Campolivar, 46110, Valencia.
          </p>
          <p>
            El uso de nuestros servicios implica la aceptación plena y sin reservas de todos los términos incluidos en 
            este documento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">2. Servicios ofrecidos</h2>
          <p className="mb-2">Balanced+ ofrece los siguientes servicios:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Clases de Pilates Reformer</li>
            <li>Clases de Yoga</li>
            <li>Clases de Entrenamiento Funcional</li>
            <li>Clases de Barre</li>
          </ul>
          <p className="mt-3">
            Todos los servicios se prestan en nuestras instalaciones físicas y requieren reserva previa a través de 
            nuestra plataforma web.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">3. Registro y cuenta de usuario</h2>
          
          <h3 className="font-medium mt-4 mb-2">3.1. Requisitos</h3>
          <p className="mb-2">Para utilizar nuestros servicios debes:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Ser mayor de 18 años, o contar con el consentimiento de tus padres o tutores legales si eres menor</li>
            <li>Proporcionar información veraz, exacta y actualizada durante el registro</li>
            <li>Mantener la confidencialidad de tu contraseña</li>
            <li>No compartir tu cuenta con terceros</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">3.2. Responsabilidad</h3>
          <p>
            Eres responsable de todas las actividades que se realicen desde tu cuenta. Debes notificarnos inmediatamente 
            si detectas un uso no autorizado de tu cuenta enviando un correo a info@balancedplus.es.
          </p>

          <h3 className="font-medium mt-4 mb-2">3.3. Cuentas personales e intransferibles</h3>
          <p>
            Cada usuario debe tener su propia cuenta. Las clases y créditos son personales e intransferibles. 
            No está permitido reservar clases para terceros utilizando tu cuenta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">4. Planes y tarifas</h2>
          
          <h3 className="font-medium mt-4 mb-2">4.1. Tipos de planes</h3>
          <p className="mb-2">Ofrecemos diferentes modalidades de suscripción:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Planes mensuales por disciplina:</strong> 4, 8 o 12 clases al mes de una disciplina específica (Pilates, Yoga, Funcional, Barre), o combinaciones de dos disciplinas</li>
            <li><strong>Plan ilimitado:</strong> Acceso ilimitado a todas las disciplinas</li>
            <li><strong>Packs de sesiones:</strong> Compra de créditos individuales sin suscripción</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">4.2. Facturación y renovación</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Las suscripciones mensuales se cobran automáticamente el <strong>día 1 de cada mes</strong></li>
            <li>El pago se realiza mediante tarjeta de crédito/débito a través de Stripe</li>
            <li>Al inicio de cada período de facturación, tus créditos de clase se reinician según tu plan contratado</li>
            <li>Los precios pueden modificarse con un preaviso mínimo de 10 días</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">4.3. Créditos mensuales</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Los créditos de clase se asignan el día 1 de cada mes según tu plan</li>
            <li><strong>Los créditos no utilizados NO se acumulan</strong> y se pierden al finalizar el mes</li>
            <li>Ejemplo: Si tienes un plan de 8 clases de Pilates y solo usas 3, las 5 restantes se pierden el día 1 del mes siguiente</li>
            <li>No se realizan reembolsos por créditos no utilizados</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">5. Reservas de clases</h2>
          
          <h3 className="font-medium mt-4 mb-2">5.1. Sistema de reservas</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Las reservas se realizan exclusivamente a través de nuestra plataforma web</li>
            <li>Debes tener créditos disponibles o un plan activo para reservar</li>
            <li>Las plazas son limitadas y se asignan por orden de reserva</li>
            <li>Al confirmar una reserva, se consume automáticamente un crédito de tu plan</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">5.2. Modificación de horarios</h3>
          <p>
            Balanced+ se reserva el derecho de modificar horarios de clases por motivos operativos, enfermedad del 
            instructor u otras causas justificadas. En estos casos, se notificará a los usuarios afectados con la 
            mayor antelación posible y se ofrecerá una alternativa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">6. Cancelaciones</h2>
          
          <h3 className="font-medium mt-4 mb-2">6.1. Cancelación de reservas por parte del usuario</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Puedes cancelar una reserva con un <strong>mínimo de 2 horas de antelación</strong> al inicio de la clase</li>
            <li>Si cancelas dentro del plazo, se te devolverá automáticamente el crédito</li>
            <li><strong>No se permite cancelar con menos de 2 horas de antelación</strong>. El sistema bloqueará esta opción</li>
            <li>Si no asistes a una clase que no has cancelado a tiempo, <strong>pierdes el crédito de forma definitiva</strong></li>
            <li>No se realizan excepciones a esta política</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">6.2. Cancelación de suscripciones</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Puedes cancelar tu suscripción en cualquier momento comunicándolo a info@balancedplus.es o personalmente en nuestras instalaciones</li>
            <li>La cancelación será efectiva al finalizar el período de facturación actual</li>
            <li><strong>No se realizan reembolsos</strong> por el tiempo restante del mes ya pagado</li>
            <li>Seguirás teniendo acceso a las clases hasta el último día del mes en curso</li>
            <li>A partir del mes siguiente, no se realizarán más cargos automáticos</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">6.3. Congelación de suscripciones</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No ofrecemos la opción de congelar suscripciones temporalmente</li>
            <li>En caso de vacaciones, lesiones o circunstancias especiales, puedes cancelar tu suscripción</li>
            <li>Si decides reactivarla más adelante y los precios han subido, <strong>mantendremos tu tarifa anterior</strong> como cortesía</li>
            <li>Esta cortesía aplica únicamente si vuelves dentro de un plazo razonable (hasta 6 meses)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">7. Política de reembolsos</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No se realizan reembolsos por suscripciones mensuales ya abonadas</li>
            <li>No se reembolsan créditos no utilizados al finalizar el mes</li>
            <li>No se reembolsan clases perdidas por no asistencia o cancelación tardía</li>
            <li>En caso de error en el cobro, contacta con nosotros en info@balancedplus.es para resolverlo</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">8. Normas de uso de las instalaciones</h2>
          
          <h3 className="font-medium mt-4 mb-2">8.1. Puntualidad</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Te recomendamos llegar <strong>5-10 minutos antes</strong> del inicio de la clase</li>
            <li>Puedes acceder a la clase con un retraso <strong>máximo de 10 minutos</strong></li>
            <li>Si llegas más tarde, el instructor puede no permitirte el acceso por motivos de seguridad y para no interrumpir la clase</li>
            <li>En ese caso, perderás el crédito de la clase</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">8.2. Higiene y vestimenta</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Se requiere ropa deportiva adecuada y limpia</li>
            <li>Mantén una higiene personal apropiada</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">8.3. Comportamiento</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Respeta a los instructores y demás usuarios</li>
            <li>Mantén los teléfonos móviles en silencio durante las clases</li>
            <li>Está prohibido grabar o fotografiar las clases sin autorización expresa</li>
            <li>Sigue las indicaciones del instructor en todo momento</li>
            <li>Informa al instructor sobre cualquier lesión o condición médica antes de la clase</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">8.4. Equipamiento</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Balanced+ proporciona todo el equipamiento necesario para las clases</li>
            <li>Debes hacer un uso correcto del material y las instalaciones</li>
            <li>Cualquier daño causado por mal uso deberá ser compensado</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">9. Salud y responsabilidad</h2>
          
          <h3 className="font-medium mt-4 mb-2">9.1. Declaración de salud</h3>
          <p className="mb-2">
            Al utilizar nuestros servicios, declaras que:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Estás en condiciones físicas adecuadas para practicar actividad física</li>
            <li>No padeces ninguna condición médica que te impida realizar ejercicio</li>
            <li>Has consultado con tu médico si tienes dudas sobre tu aptitud física</li>
          </ul>

          <h3 className="font-medium mt-4 mb-2">9.2. Información médica</h3>
          <p>
            Nuestros instructores te preguntarán sobre tu estado físico y posibles lesiones o condiciones médicas 
            antes de las clases. Es tu responsabilidad informar de forma veraz y completa sobre cualquier circunstancia 
            que pueda afectar tu práctica.
          </p>

          <h3 className="font-medium mt-4 mb-2">9.3. Limitación de responsabilidad</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Balanced+ no se hace responsable de lesiones derivadas del incumplimiento de las indicaciones del instructor</li>
            <li>La práctica de actividad física conlleva riesgos inherentes que el usuario asume voluntariamente</li>
            <li>Recomendamos contar con un seguro médico personal</li>
            <li>Balanced+ cuenta con seguro de responsabilidad civil, pero este no cubre lesiones auto-infligidas o por negligencia del usuario</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">10. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del sitio web (textos, imágenes, logos, diseños, software) son propiedad de OCEANS WELLNESS, S.L. 
            o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución o modificación sin 
            autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">11. Suspensión y terminación</h2>
          <p className="mb-2">
            Balanced+ se reserva el derecho de suspender o terminar tu acceso a los servicios en caso de:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Incumplimiento de estos Términos y Condiciones</li>
            <li>Comportamiento inapropiado o irrespetuoso hacia el personal o usuarios</li>
            <li>Uso fraudulento de la plataforma o los servicios</li>
            <li>Impago de cuotas o servicios</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">12. Modificaciones</h2>
          <p>
            Balanced+ se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. 
            Los cambios se comunicarán a través del sitio web y/o por correo electrónico con al menos 15 días de antelación. 
            El uso continuado de los servicios tras la modificación implica la aceptación de los nuevos términos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">13. Protección de datos</h2>
          <p>
            El tratamiento de tus datos personales se rige por nuestra{' '}
            <a href="/privacidad" className="underline hover:opacity-70">Política de Privacidad</a>, 
            que forma parte integrante de estos Términos y Condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">14. Ley aplicable y jurisdicción</h2>
          <p>
            Estos Términos y Condiciones se rigen por la legislación española. Para la resolución de cualquier 
            controversia, las partes se someten a los Juzgados y Tribunales de Valencia, renunciando expresamente 
            a cualquier otro fuero que pudiera corresponderles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-4">15. Contacto</h2>
          <p>
            Para cualquier duda o consulta sobre estos Términos y Condiciones, puedes contactarnos:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Email: info@balancedplus.es</li>
            <li>Teléfono: +34 678 52 81 65</li>
            <li>Dirección: Avenida Acacias, 16, Campolivar, 46110, Valencia</li>
          </ul>
        </section>

        <p className="text-xs opacity-75 mt-12">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}