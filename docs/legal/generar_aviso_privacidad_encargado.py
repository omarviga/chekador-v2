"""
Genera el Aviso de Privacidad de Chekdor como ENCARGADO del tratamiento.

Uso:
    python docs/legal/generar_aviso_privacidad_encargado.py

Salida:
    docs/legal/Aviso_Privacidad_Encargado_Chekdor.docx

Este es el aviso que se PUBLICA en el sitio, dirigido a los trabajadores
cuyos datos trata Chekdor por cuenta de su patrón.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from _comun import (  # noqa: E402
    caja_aviso,
    documento_nuevo,
    encabezado_seccion,
    numerada,
    parrafo,
    pie_de_pagina,
    tabla,
    vinetas,
)

SALIDA = Path(__file__).parent / "Aviso_Privacidad_Encargado_Chekdor.docx"

TITULO = "AVISO DE PRIVACIDAD"
SUBTITULO = "Chekdor · En su carácter de ENCARGADO del tratamiento"


def construir() -> None:
    doc = documento_nuevo(TITULO, SUBTITULO)

    caja_aviso(
        doc,
        "CAMPO POR COMPLETAR — elimina este recuadro al publicar",
        "Sustituye la razón social, el RFC y el domicilio de Chekdor, la fecha de la última "
        "actualización y las regiones de los proveedores de nube. La versión que se publica "
        "en el sitio web es la que va **sin** este recuadro y **sin** las notas internas "
        "marcadas como tales.",
        "rojo",
    )

    # =================================================================
    # Encabezado
    # =================================================================
    parrafo(
        doc,
        "**CHEKDOR** (en adelante, __“Chekdor”__ o el __“Encargado”__), con Registro "
        "Federal de Contribuyentes ● y domicilio en ●, es una empresa que presta un "
        "servicio de cómputo en la nube para el registro de asistencia laboral, el cálculo "
        "de nómina y la generación de archivos de exportación contable (el __“Servicio”__).",
    )
    parrafo(
        doc,
        "El presente aviso de privacidad se pone a disposición de las personas "
        "trabajadoras, exempleadas, candidatas y prestadoras de servicios cuyos datos "
        "personales son cargados en el Servicio por parte de su empleador o contratante "
        "(en adelante, el __“Patrón”__ o el __“Responsable”__), en cumplimiento de los "
        "artículos 15, 16 y 17 de la Ley Federal de Protección de Datos Personales en "
        "Posesión de los Particulares (la __“Ley”__) y de los Lineamientos del Aviso de "
        "Privacidad.",
    )

    # =================================================================
    # 1. Lo más importante
    # =================================================================
    encabezado_seccion(doc, "1. Lo más importante, en una frase")
    caja_aviso(
        doc,
        "Chekdor NO es el responsable de tus datos personales: lo es tu patrón.",
        "Tu patrón decide qué datos se recaban, para qué se usan y cuánto tiempo se "
        "conservan. Chekdor únicamente los guarda y los procesa **siguiendo sus "
        "instrucciones**, y no puede usarlos para fines propios ni venderlos. Por eso, "
        "**si quieres ejercer tus derechos sobre tus datos, debes dirigirte a tu "
        "patrón**, que es quien puede responderte. En el apartado 8 te explicamos cómo.",
        "ambar",
    )

    # =================================================================
    # 2. Responsable
    # =================================================================
    encabezado_seccion(doc, "2. Identidad y domicilio del Responsable")
    parrafo(
        doc,
        "El **Responsable** del tratamiento de tus datos personales es la empresa o "
        "persona para la que trabajas o prestas tus servicios, es decir, tu Patrón. Los "
        "datos de identificación, domicilio y contacto del área encargada de la protección "
        "de datos de tu Patrón los puedes consultar directamente con él, o bien en el aviso "
        "de privacidad que tu Patrón está obligado a poner a tu disposición.",
    )
    parrafo(
        doc,
        "Chekdor interviene **únicamente como Encargado** del tratamiento, en términos del "
        "artículo 3, fracción XIII, de la Ley, y por lo tanto:",
    )
    vinetas(
        doc,
        [
            "No determina las finalidades del tratamiento ni los datos que se recaban.",
            "No puede tratar tus datos para finalidades distintas a las que le instruye tu "
            "Patrón.",
            "No puede transferir tus datos a nadie más que a los proveedores de "
            "infraestructura tecnológica que se indican en el apartado 7.",
            "No puede vender, rentar ni ceder tus datos personales.",
            "No puede usar tus datos para publicidad, prospección comercial ni para "
            "entrenar modelos de inteligencia artificial.",
        ],
    )

    # =================================================================
    # 3. Datos que se tratan
    # =================================================================
    encabezado_seccion(doc, "3. ¿Qué datos personales tratamos?")
    parrafo(
        doc,
        "Chekdor trata los datos que tu Patrón captura o carga en el Servicio. Son los "
        "siguientes:",
    )
    tabla(
        doc,
        ["Categoría", "Datos concretos"],
        [
            [
                "Datos de identificación",
                "Nombre completo, código de empleado, fotografía (si tu Patrón decide "
                "subirla) y el identificador de la tarjeta NFC que se te haya asignado.",
            ],
            [
                "Datos de identificación oficial",
                "CURP, Registro Federal de Contribuyentes (RFC) y Número de Seguridad "
                "Social (NSS).",
            ],
            [
                "Datos laborales",
                "Puesto, departamento, tipo de contrato, fecha de ingreso, jornada semanal "
                "contratada y salario diario.",
            ],
            [
                "Datos de tu jornada de trabajo",
                "Fecha y hora de cada entrada, salida e interrupción; el punto de marcaje "
                "en el que se registró; y datos técnicos del dispositivo que se usó para "
                "marcar (dirección IP y tipo de navegador).",
            ],
            [
                "Datos de nómina y patrimoniales",
                "Días pagados, percepciones y deducciones, ISR retenido, cuotas del IMSS, "
                "aportaciones al SAR e INFONAVIT, neto a pagar, y los datos bancarios "
                "(banco, CLABE o número de cuenta) para depositar tu pago.",
            ],
            [
                "Datos sobre descuentos",
                "Pensión alimenticia, préstamos o créditos y descuento por crédito "
                "INFONAVIT, cuando tu Patrón los haya registrado.",
            ],
            [
                "~~Datos personales sensibles~~",
                "~~Únicamente si tu Patrón usa el módulo de la NOM-035: el resultado de tu "
                "evaluación de factores de riesgo psicosocial. Este dato requiere tu "
                "consentimiento expreso y por escrito, que tu Patrón debe recabar.~~",
            ],
        ],
        [4.5, 10.5],
    )
    parrafo(
        doc,
        "**No recabamos** datos personales sobre tu origen racial o étnico, estado de "
        "salud distinto del señalado, información genética, creencias religiosas, "
        "filosóficas o morales, opiniones políticas, preferencia sexual ni datos de niñas, "
        "niños o adolescentes. Si detectas que alguno de estos datos fue cargado en el "
        "Servicio, te pedimos reportarlo al correo del apartado 10.",
    )

    # =================================================================
    # 4. Finalidades
    # =================================================================
    encabezado_seccion(doc, "4. ¿Para qué usamos tus datos?")
    parrafo(doc, "**Finalidades primarias** (necesarias para el servicio que tu Patrón contrató):")
    numerada(
        doc,
        [
            "Permitir que tu tarjeta NFC o tu teléfono registren tu entrada, salida e "
            "interrupciones de jornada.",
            "Calcular tus horas de trabajo y tu tiempo extraordinario conforme a la Ley "
            "Federal del Trabajo.",
            "Calcular tu nómina del periodo, incluyendo percepciones, deducciones y las "
            "retenciones y cuotas que correspondan.",
            "Generar los archivos y reportes que tu Patrón necesita para su contabilidad y "
            "para cumplir con sus obligaciones ante el IMSS, el SAT y el INFONAVIT.",
            "Atender los reportes de asistencia y jornada que solicite tu Patrón o que "
            "requiera una autoridad laboral.",
            "Registrar la evidencia de que recibiste el aviso de privacidad de tu Patrón y, "
            "en su caso, de que otorgaste tu consentimiento.",
            "Dar seguimiento a las solicitudes de derechos que presentes ante tu Patrón, "
            "cuando él use los módulos correspondientes del Servicio.",
        ],
    )
    parrafo(doc, "**Finalidades secundarias** (no necesarias para el servicio):")
    parrafo(
        doc,
        "~~Ninguna. Chekdor no utiliza tus datos personales para finalidades de "
        "mercadotecnia, publicidad, prospección comercial ni elaboración de perfiles con "
        "fines comerciales.~~ Por lo tanto, no se requiere que otorgues consentimiento "
        "alguno para finalidades secundarias.",
    )
    parrafo(
        doc,
        "**Chekdor tampoco utiliza tus datos para entrenar modelos de inteligencia "
        "artificial** ni para generar análisis agregados que comercialice con terceros.",
    )

    # =================================================================
    # 5. Transferencias
    # =================================================================
    encabezado_seccion(doc, "5. Transferencias de datos")
    parrafo(
        doc,
        "Tus datos **no se venden, rentan ni ceden** a terceros. Únicamente se comunican a "
        "los proveedores de infraestructura tecnológica que se describen en el apartado 7, "
        "que actúan como encargados adicionales y están obligados contractualmente a las "
        "mismas obligaciones de protección que Chekdor.",
    )
    parrafo(
        doc,
        "Cuando tu Patrón descarga los archivos de nómina o los reportes y los incorpora a "
        "su sistema contable (por ejemplo, CONTPAQi o Aspel) o los entrega a su contador, "
        "esa comunicación ocurre fuera del Servicio y es responsabilidad exclusiva de tu "
        "Patrón. Chekdor no controla ni responde por el tratamiento que esos terceros "
        "realicen.",
    )

    # =================================================================
    # 6. Derechos ARCO
    # =================================================================
    encabezado_seccion(doc, "6. Tus derechos sobre tus datos personales")
    parrafo(doc, "Como titular de datos personales, tienes derecho a:")
    tabla(
        doc,
        ["Derecho", "En qué consiste"],
        [
            [
                "Acceso",
                "Conocer qué datos personales tenemos de ti y las condiciones de su uso. "
                "Incluye tu derecho a obtener una copia de tus datos.",
            ],
            [
                "Rectificación",
                "Solicitar que se corrijan tus datos cuando sean inexactos, incompletos o "
                "no correspondan a la realidad. Por ejemplo, un NSS mal capturado o un "
                "nombre mal escrito.",
            ],
            [
                "Cancelación",
                "Solicitar que se supriman tus datos cuando consideres que no están siendo "
                "tratados conforme a los principios y deberes de la Ley.",
            ],
            [
                "Oposición",
                "Oponerte al tratamiento de tus datos para una finalidad determinada.",
            ],
            [
                "Revocación del consentimiento",
                "Retirar el consentimiento que hayas otorgado, cuando el tratamiento se "
                "base en él. ~~Es el caso de la evaluación de riesgos psicosociales.~~",
            ],
            [
                "Limitar el uso o divulgación",
                "Solicitar que se restrinja el uso o la divulgación de tus datos.",
            ],
        ],
        [4.2, 10.8],
    )

    caja_aviso(
        doc,
        "IMPORTANTE: tus derechos se ejercen ante tu PATRÓN, no ante Chekdor",
        "Chekdor **no puede atender** directamente tu solicitud, porque no es el "
        "responsable del tratamiento y no está facultado para acreditar tu identidad ni "
        "para determinar si tu solicitud es procedente. **Dirige tu solicitud al área de "
        "recursos humanos, al área administrativa o al oficial de privacidad de la empresa "
        "para la que trabajas.**",
        "ambar",
    )
    parrafo(
        doc,
        "Si por cualquier motivo presentas tu solicitud directamente a Chekdor, la "
        "**canalizaremos a tu Patrón dentro de los tres (3) días hábiles** siguientes, te "
        "informaremos de ello y no emitiremos una respuesta por nuestra cuenta. Tu Patrón "
        "es quien debe responderte dentro de los **veinte (20) días hábiles** que establece "
        "la Ley.",
    )

    # =================================================================
    # 7. Encargados adicionales y transferencia internacional
    # =================================================================
    encabezado_seccion(
        doc,
        "7. Proveedores tecnológicos y transferencia internacional de datos",
    )
    parrafo(
        doc,
        "Para poder operar el Servicio, Chekdor se apoya en proveedores de infraestructura "
        "de cómputo en la nube. **Esto implica que tus datos se almacenan y se procesan en "
        "servidores ubicados fuera de México**, lo que constituye una transferencia "
        "internacional en los términos del artículo 34 de la Ley. Tu Patrón ha autorizado "
        "esta transferencia al contratar el Servicio.",
    )
    caja_aviso(
        doc,
        "CAMPO POR COMPLETAR — verifica la región real de tu proyecto",
        "Los nombres y las ubicaciones deben corresponder a lo que está **realmente** "
        "contratado. Consulta la región en el panel de cada proveedor antes de publicar "
        "este aviso. Si declaras una región distinta de la real, el aviso es inexacto.",
        "rojo",
    )
    tabla(
        doc,
        ["Proveedor", "Para qué se usa", "Dónde están los servidores"],
        [
            [
                "Supabase, Inc.",
                "Alojamiento de la base de datos donde se guardan tus datos y servicio de "
                "autenticación de usuarios.",
                "● (verificar la región del proyecto).",
            ],
            [
                "Vercel Inc.",
                "Alojamiento de la aplicación web que tu Patrón y tú utilizan, y ejecución "
                "del servidor de aplicaciones.",
                "● (verificar la región del proyecto).",
            ],
            [
                "● (proveedor de correo transaccional)",
                "Envío de los correos de confirmación de cuenta y de notificaciones del "
                "Servicio. Recibe el nombre y el correo electrónico de los usuarios "
                "administrativos de tu Patrón.",
                "●",
            ],
        ],
        [3.8, 7.2, 4.0],
    )
    parrafo(
        doc,
        "Todos estos proveedores están obligados por contrato a **no usar tus datos para "
        "fines propios**, a mantener medidas de seguridad equivalentes a las de Chekdor y a "
        "guardar confidencialidad sobre la información.",
    )

    # =================================================================
    # 8. Seguridad
    # =================================================================
    encabezado_seccion(doc, "8. Medidas de seguridad")
    parrafo(
        doc,
        "Chekdor ha implementado medidas administrativas, técnicas y físicas para proteger "
        "tus datos personales. Entre ellas:",
    )
    vinetas(
        doc,
        [
            "**Cifrado en tránsito:** toda la información viaja cifrada mediante HTTPS/TLS "
            "entre tu dispositivo, el Servicio y la base de datos.",
            "**Aislamiento por empresa:** la base de datos aplica reglas de seguridad a "
            "nivel de fila que impiden que una empresa pueda consultar la información de "
            "otra. Cada consulta se restringe automáticamente a la empresa de la persona "
            "que inició sesión.",
            "**Control de acceso por roles:** únicamente el personal administrativo de tu "
            "Patrón puede consultar la nómina. Un compañero de trabajo **no puede ver** tu "
            "recibo, tu salario ni tu jornada.",
            "**Confidencialidad de los resultados de la NOM-035:** los resultados de la "
            "evaluación de riesgo psicosocial solo son visibles para ti y para el personal "
            "administrativo autorizado. Tus compañeros no pueden consultarlos.",
            "**Bitácora de auditoría:** las acciones relevantes sobre los datos quedan "
            "registradas, indicando quién las hizo y cuándo.",
            "**Respaldo diario** de la base de datos.",
            "**Confidencialidad del personal de Chekdor:** todo el personal que interviene "
            "en el tratamiento está obligado por contrato a guardar confidencialidad, "
            "obligación que subsiste aun después de terminar su relación laboral.",
        ],
    )
    caja_aviso(
        doc,
        "Nota de transparencia",
        "Chekdor se encuentra en etapa de crecimiento y **no cuenta todavía con "
        "certificación ISO 27001 ni con el Distintivo de Confianza del INAI**. Tampoco ha "
        "realizado una prueba de penetración por un tercero independiente. Las medidas "
        "enlistadas son las que están efectivamente implementadas al día de hoy. Si "
        "necesitas conocer el detalle completo y las medidas en proceso de implementación, "
        "puedes consultar el Anexo B del Contrato de Encargo de Tratamiento o escribirnos "
        "al correo del apartado 10.",
        "ambar",
    )

    # =================================================================
    # 9. Conservación
    # =================================================================
    encabezado_seccion(doc, "9. ¿Cuánto tiempo conservamos tus datos?")
    parrafo(
        doc,
        "**El plazo lo define tu Patrón**, porque es él quien es el responsable del "
        "tratamiento y quien conoce las obligaciones legales que le aplican. Chekdor "
        "conserva tus datos mientras la cuenta de tu Patrón esté activa y, una vez que el "
        "Patrón termina la relación con Chekdor:",
    )
    numerada(
        doc,
        [
            "Tus datos permanecen disponibles para que el Patrón los descargue durante "
            "**treinta (30) días naturales** contados a partir de la terminación.",
            "Transcurrido ese plazo, se **suprimen** de los sistemas de Chekdor dentro de "
            "los quince (15) días naturales siguientes, junto con los de todos los demás "
            "trabajadores de esa cuenta.",
            "La supresión es completa: al eliminar la cuenta se eliminan los empleados, los "
            "marcajes, las jornadas y los recibos de nómina asociados.",
            "Podrán conservarse los datos que deban mantenerse por mandato legal o para la "
            "defensa de un derecho en un procedimiento, en cuyo caso tu Patrón lo sabrá y "
            "podrá informártelo.",
        ],
    )

    # =================================================================
    # 10. Contacto y cambios
    # =================================================================
    encabezado_seccion(doc, "10. Contacto y cambios a este aviso")
    parrafo(
        doc,
        "**Para dudas sobre este aviso o para reportar un uso indebido de tus datos** "
        "puedes escribir a:",
    )
    tabla(
        doc,
        ["", "Datos de contacto"],
        [
            ["Correo electrónico", "privacidad@chekdor.com.mx"],
            ["Domicilio", "●"],
            ["Teléfono", "●"],
        ],
        [4.5, 10.5],
    )
    parrafo(
        doc,
        "**Recuerda:** Chekdor **no puede** atender tu solicitud de derechos ARCO; esa "
        "solicitud corresponde a tu Patrón. El correo anterior es solo para dudas sobre "
        "este aviso o para reportar un incidente de seguridad.",
    )
    parrafo(doc, "**Cambios a este aviso.**")
    vinetas(
        doc,
        [
            "Este aviso puede actualizarse por cambios en el Servicio, en la legislación "
            "aplicable o en nuestras prácticas de privacidad.",
            "La versión vigente estará siempre publicada en esta misma dirección, con su "
            "fecha de última actualización visible.",
            "Cuando el cambio sea relevante para tus derechos, Chekdor lo comunicará a tu "
            "Patrón para que él, como responsable, te lo haga saber por los medios que "
            "utilice habitualmente.",
            "No modificaremos este aviso para ampliar las finalidades del tratamiento sin "
            "que medie la autorización de tu Patrón y, cuando la Ley lo exija, tu "
            "consentimiento.",
        ],
    )

    parrafo(doc, "**Fecha de última actualización:** ● de ● de ●●.", justificar=False)
    parrafo(doc, "**Versión:** 1.0", justificar=False)

    # =================================================================
    # Notas internas
    # =================================================================
    doc.add_page_break()
    encabezado_seccion(doc, "NOTAS INTERNAS — no publicar")
    caja_aviso(
        doc,
        "Este bloque es para el equipo de Chekdor, no forma parte del aviso publicado",
        "Al publicar el aviso en el sitio web, elimina esta página completa. Se incluye "
        "aquí porque el mismo archivo sirve como versión revisable y como fuente del texto "
        "publicado, y es más fácil mantener un solo documento.",
        "rojo",
    )
    encabezado_seccion(doc, "Por qué este aviso dice lo que dice")
    numerada(
        doc,
        [
            "**Se declara desde el primer párrafo que Chekdor es encargado y no "
            "responsable.** Es el error más frecuente en avisos de proveedores de software: "
            "publicar un aviso como si la empresa fuera responsable de datos que en realidad "
            "le fueron confiados. Eso confunde al titular, que termina pidiendo sus derechos "
            "al proveedor equivocado.",
            "**El apartado 6 explica cómo ejercer los derechos ARCO, pero remite al "
            "patrón.** El encargado no puede acreditar la identidad del titular ni resolver "
            "la procedencia de la solicitud. Decir lo contrario generaría expectativas que "
            "no se pueden cumplir y, con ellas, reclamaciones.",
            "**El apartado 7 declara la transferencia internacional.** Los datos se alojan "
            "en servidores fuera de México. Omitirlo convertiría el aviso en inexacto, "
            "porque afecta directamente la forma en que se tratan los datos.",
            "**El apartado 8 incluye una nota de transparencia sobre lo que no se tiene.** "
            "Es más defendible decir lo que falta que dejar que un prospecto lo descubra en "
            "la negociación. Un aviso que promete controles inexistentes es, en sí mismo, "
            "publicidad engañosa.",
            "**No se promete ninguna certificación.** ISO 27001 y el Distintivo de Confianza "
            "del INAI son procesos que no se han iniciado. No deben aparecer ni siquiera "
            "como 'en trámite'.",
            "**El apartado 4 declara que no hay finalidades secundarias ni entrenamiento de "
            "modelos.** Esta es una decisión de producto, no solo una frase: obliga a que "
            "cualquier funcionalidad futura que quiera usar los datos para otra cosa pase "
            "primero por una actualización del aviso.",
        ],
    )

    encabezado_seccion(doc, "Checklist antes de publicar")
    tabla(
        doc,
        ["#", "Punto a verificar", "Estado"],
        [
            ["1", "Razón social, RFC y domicilio reales de Chekdor.", "Pendiente"],
            ["2", "Región real del proyecto de Supabase y de Vercel.", "Pendiente"],
            ["3", "Proveedor de correo transaccional confirmado y publicado.", "Pendiente"],
            [
                "4",
                "Correo privacidad@chekdor.com.mx **creado y con alguien que lo lea**.",
                "Pendiente",
            ],
            ["5", "Fecha de última actualización y versión.", "Pendiente"],
            ["6", "Publicado en una URL pública, sin requerir inicio de sesión.", "Pendiente"],
            [
                "7",
                "Enlazado desde el pie de página de la landing (sustituye el enlace al "
                "login de la sección de privacidad y cumplimiento).",
                "Pendiente",
            ],
            [
                "8",
                "Verificar que el acceso al marcaje NFC **no** recabe la ubicación del "
                "empleado, solo la del punto. Si algún día se recaba la del empleado, este "
                "aviso debe actualizarse antes de activarlo.",
                "Verificado",
            ],
        ],
        [1.2, 11.0, 2.8],
    )

    pie_de_pagina(doc, "Aviso de Privacidad · Chekdor como Encargado")

    doc.save(SALIDA)
    print(f"OK -> {SALIDA}")


if __name__ == "__main__":
    construir()
