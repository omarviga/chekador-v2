"""
FUENTE ÚNICA del Contrato de Prestación de Servicios de Chekdor.

Igual que los Términos y Condiciones, el texto vive como DATOS y no como
formato. De aquí se generan dos salidas que deben decir exactamente lo
mismo:

    python docs/legal/servicios/generar_docx.py   -> .docx para firmar

El contrato de servicios NO se publica en el sitio: se firma con cada
cliente. Por eso solo hay un generador.

REPARTO DE MATERIAS ENTRE LOS TRES DOCUMENTOS
    · Términos y Condiciones  → la relación estándar, aceptada al registrarse
    · Contrato de Servicios   → lo NEGOCIADO: plan, precio, vigencia, SLA
    · Contrato de Encargo     → el tratamiento de datos personales
La sección de prevalencia de este contrato fija el orden entre los tres.

Formato de los bloques (idéntico a contenido_terminos.py):
    ("p",  "texto")                    párrafo (con marcado **negrita**)
    ("h",  "Título de sección")        encabezado numerado automáticamente
    ("ul", ["viñeta", "viñeta"])       lista con viñetas
    ("ol", ["inciso", "inciso"])       lista numerada
    ("tabla", (["a","b"], [[...]]))    tabla
    ("aviso", ("título", "texto", "tono"))   recuadro destacado
"""

from typing import Any

# =====================================================================
# Metadatos
# =====================================================================
TITULO = "CONTRATO DE PRESTACIÓN DE SERVICIOS"
SUBTITULO = "Chekdor · Suscripción al sistema de control de asistencia, cálculo de nómina y exportación contable"
VERSION = "1.0"
PROVEEDOR = "Chekdor"
CORREO_LEGAL = "legal@chekdor.com.mx"
CORREO_SOPORTE = "soporte@chekdor.com.mx"
CORREO_PRIVACIDAD = "privacidad@chekdor.com.mx"

# Referencias cruzadas: deben coincidir con los otros dos documentos.
URL_TERMINOS = "/terminos"
URL_AVISO = "/privacidad-encargado"

# =====================================================================
# Bloques
# =====================================================================
BLOQUES: list[tuple[str, Any]] = [
    # -----------------------------------------------------------------
    ("aviso", (
        "PLANTILLA — completa los recuadros y el Anexo I antes de firmar",
        "Los campos marcados con **●** deben completarse. El **Anexo I (Datos del "
        "servicio contratado)** es lo que convierte esta plantilla en un contrato: sin él "
        "no hay plan, precio ni vigencia determinados. Elimina los recuadros de "
        "instrucciones antes de imprimir.",
        "rojo",
    )),

    ("p",
     "**CONTRATO DE PRESTACIÓN DE SERVICIOS** que celebran, por una parte, **CHEKDOR** "
     "(en lo sucesivo, el __“Proveedor”__) y, por la otra, la persona moral o física "
     "identificada en el apartado de Declaraciones como cliente (en lo sucesivo, el "
     "__“Cliente”__), a quienes conjuntamente se les denominará las __“Partes”__, al "
     "tenor de las siguientes declaraciones y cláusulas:"),

    # ============================ DECLARACIONES ======================
    ("h", "Declaraciones"),

    ("p", "**I. Declara el Proveedor**, por conducto de su representante legal, que:"),
    ("ol", [
        "Es una sociedad constituida conforme a las leyes de los Estados Unidos "
        "Mexicanos, según consta en la escritura pública número ● de fecha ●, otorgada "
        "ante la fe del Notario Público número ● de la ciudad de ●, inscrita en el "
        "Registro Público de Comercio bajo el folio mercantil número ●.",
        "Su Registro Federal de Contribuyentes es ● y su domicilio fiscal se ubica en ●.",
        "Su representante legal cuenta con las facultades suficientes para celebrar el "
        "presente Contrato, mismas que acredita con ● y que no le han sido revocadas ni "
        "modificadas a la fecha de su firma.",
        "Es una empresa que desarrolla y opera un sistema en línea para el registro de "
        "asistencia laboral mediante tecnología NFC, el cálculo de nómina y la generación "
        "de archivos de exportación contable, accesible en chekdor.com.mx y sus "
        "subdominios (el __“Servicio”__).",
        "Cuenta con la experiencia, el personal y la infraestructura necesarios para "
        "prestar el Servicio en los términos de este Contrato.",
        "Es su voluntad obligarse en los términos del presente Contrato.",
    ]),

    ("p", "**II. Declara el Cliente**, por conducto de su representante legal, que:"),
    ("ol", [
        "Es una persona física o moral de nacionalidad mexicana, según se desprende de ●.",
        "Su Registro Federal de Contribuyentes es ● y su domicilio se ubica en ●.",
        "Su representante legal cuenta con facultades suficientes para obligarlo en los "
        "términos del presente Contrato, mismas que no le han sido revocadas ni "
        "modificadas a la fecha.",
        "Es patrón de los trabajadores cuyos datos cargará en el Servicio y, en "
        "consecuencia, **Responsable** del tratamiento de sus datos personales conforme a "
        "la Ley Federal de Protección de Datos Personales en Posesión de los Particulares "
        "(la __“Ley de Datos”__).",
        "Conoce las funcionalidades del Servicio, sus alcances y sus límites, los cuales "
        "se describen en la cláusula Sexta y en los Términos y Condiciones publicados en "
        f"{URL_TERMINOS}, y ha tenido la oportunidad de evaluarlo durante el periodo de "
        "prueba.",
        "Es su voluntad obligarse en los términos del presente Contrato.",
    ]),

    ("p",
     "**III. Declaran ambas Partes** que se reconocen mutuamente la personalidad con la "
     "que se ostentan y que es su voluntad celebrar el presente Contrato, con base en lo "
     "anterior y en las siguientes:"),

    # ============================ CLÁUSULAS ==========================
    ("h", "Objeto"),
    ("p",
     "El Proveedor se obliga a proporcionar al Cliente el acceso y uso del Servicio en la "
     "modalidad, con el alcance y durante el plazo establecidos en el **Anexo I** de este "
     "Contrato, y el Cliente se obliga a pagar la contraprestación ahí señalada, en los "
     "términos de las cláusulas siguientes."),
    ("p",
     "El presente Contrato se complementa con los **Términos y Condiciones de Servicio** "
     f"publicados en {URL_TERMINOS}, que el Cliente declara conocer y aceptar. El reparto "
     "de materias entre los documentos de la relación contractual se establece en la "
     "cláusula Decimosexta."),

    ("h", "Documentos que integran la relación contractual"),
    ("p", "Forman parte integrante e inseparable de este Contrato:"),
    ("ol", [
        "El presente **Contrato de Prestación de Servicios**, incluyendo su Anexo I "
        "(Datos del servicio contratado) y, en su caso, sus anexos técnicos.",
        "El **Contrato de Encargo de Tratamiento de Datos Personales** que las Partes "
        "suscriban, que regula todo lo relativo al tratamiento de datos personales.",
        "Los **Términos y Condiciones de Servicio** publicados en el sitio del Proveedor, "
        "en la versión vigente al momento de la firma.",
        "Las **órdenes de servicio**, adendas o cotizaciones aceptadas por escrito por "
        "ambas Partes con posterioridad, que se integrarán al Anexo I.",
    ]),

    ("h", "Vigencia"),
    ("ol", [
        "El Contrato entra en vigor el día de su firma y tendrá una **vigencia inicial "
        "de doce (12) meses** contados a partir de la fecha de inicio señalada en el "
        "Anexo I, salvo que las Partes pacten un plazo distinto en ese anexo.",
        "Al término de la vigencia inicial, el Contrato **se prorrogará automáticamente "
        "por periodos sucesivos de doce (12) meses**, salvo que cualquiera de las Partes "
        "manifieste por escrito su voluntad de no prorrogarlo con al menos **treinta (30) "
        "días naturales** de anticipación al vencimiento del periodo en curso.",
        "El periodo de prueba gratuito de **catorce (14) días naturales**, cuando el "
        "Cliente lo haya utilizado, **no cuenta como parte de la vigencia inicial**: el "
        "plazo de doce meses comienza en la fecha de inicio que se anote en el Anexo I, "
        "que será la fecha del primer cobro.",
        "La terminación anticipada se rige por la cláusula Decimocuarta.",
    ]),

    ("h", "Alcance del Servicio"),
    ("p", "El Servicio comprende las siguientes funciones, en la medida en que el plan "
          "contratado las incluya conforme al Anexo I:"),
    ("ul", [
        "**Registro de asistencia por NFC**, con puntos de marcaje ilimitados o el número "
        "que corresponda al plan.",
        "**Cálculo de jornadas** conforme a la Ley Federal del Trabajo: tope de jornada "
        "diaria, reparto semanal del tiempo extraordinario al doble y al triple, y prima "
        "dominical.",
        "**Cálculo de nómina**: percepciones, deducciones, exenciones, retención de ISR "
        "con subsidio al empleo, cuotas obrero-patronales del IMSS, aportaciones al SAR e "
        "INFONAVIT.",
        "**Exportación contable**: archivos de nómina y pólizas contables para su "
        "importación en sistemas de contabilidad, y reportes de asistencia y jornadas.",
        "**Módulos de cumplimiento**: aviso de privacidad y consentimientos, atención de "
        "solicitudes de derechos ARCO y valuación de factores de riesgo psicosocial de la "
        "NOM-035.",
        "**Soporte técnico** en los términos de la cláusula Octava.",
    ]),

    ("h", "Lo que el Servicio no comprende"),
    ("p",
     "Para evitar cualquier controversia posterior, las Partes reconocen que el Servicio "
     "**no incluye** lo siguiente, que queda a cargo exclusivo del Cliente:"),
    ("ol", [
        "**El timbrado de CFDI**, de nómina o de cualquier otro tipo. El Servicio calcula "
        "y genera los archivos, pero el timbrado ante el Servicio de Administración "
        "Tributaria requiere un Proveedor Autorizado de Certificación que el Cliente debe "
        "contratar por su cuenta.",
        "**La presentación de declaraciones y el pago de contribuciones.** El entero de "
        "ISR, de cuotas del IMSS y de aportaciones al SAR y al INFONAVIT es "
        "responsabilidad exclusiva del Cliente.",
        "**La asesoría contable, fiscal o jurídica.** El Proveedor no actúa como contador "
        "público, asesor fiscal ni abogado del Cliente, y no emite dictamen u opinión "
        "alguna sobre el resultado de los cálculos.",
        "**La integración por interfaz de programación con sistemas de contabilidad de "
        "terceros.** La entrega de información se realiza mediante archivos que el Cliente "
        "descarga e importa en sus propios sistemas.",
        "**La verificación de la veracidad de los datos** que el Cliente captura. El "
        "Proveedor valida formatos, pero no la exactitud ni la autenticidad de la "
        "información.",
        "**La instalación, configuración y soporte de los equipos, la red, los tags NFC y "
        "los dispositivos** del Cliente.",
        "**La capacitación de los trabajadores del Cliente** en el uso del marcaje, salvo "
        "el material de apoyo que el Proveedor publique.",
    ]),
    ("aviso", (
        "El cálculo de nómina es una herramienta, no un dictamen",
        "El Servicio aplica las tasas, tarifas y parámetros que el Cliente configura y "
        "los vigentes en sus catálogos. **El Cliente, y su contador, son responsables de "
        "validar los resultados antes de timbrar o de pagar cualquier cantidad.** El "
        "Proveedor muestra en la interfaz cuándo está utilizando un valor de respaldo en "
        "lugar del cargado en la base de datos, y publica la fuente oficial de cada "
        "parámetro en su documentación. Verificar esos valores es obligación del Cliente.",
        "ambar",
    )),

    ("h", "Contraprestación y forma de pago"),
    ("p",
     "El Cliente pagará al Proveedor la contraprestación señalada en el **Anexo I**, más "
     "el Impuesto al Valor Agregado que corresponda, en su caso, conforme a la "
     "legislación aplicable."),
    ("ol", [
        "**Periodicidad.** El cobro es mensual y anticipado, salvo que el Anexo I "
        "establezca otra cosa.",
        "**Medio de pago.** El pago se realizará mediante el medio que el Proveedor "
        "disponga, que por omisión es el cobro recurrente a la tarjeta registrada por el "
        "Cliente en la plataforma de pagos del Proveedor. El Cliente es responsable de "
        "mantener vigente su método de pago.",
        "**Moneda.** Los importes se expresan y se pagan en pesos mexicanos. Cualquier "
        "diferencia cambiaria o comisión bancaria corre por cuenta del Cliente.",
        "**Comprobante fiscal.** El Proveedor entregará al Cliente el comprobante fiscal "
        "digital que corresponda por cada cobro. El Cliente es responsable de proporcionar "
        "correctamente sus datos fiscales y de revisar el comprobante dentro de los **cinco "
        "(5) días hábiles** siguientes a su recepción. Los errores en los datos fiscales "
        "proporcionados por el Cliente no son imputables al Proveedor.",
        "**Ajuste anual.** El Proveedor podrá **ajustar anualmente** la contraprestación "
        "conforme a la inflación observada, medida por el Índice Nacional de Precios al "
        "Consumidor que publica el INEGI, o conforme a la variación que las Partes pacten. "
        "El ajuste se notificará al Cliente con al menos **treinta (30) días naturales** de "
        "anticipación y no podrá exceder la variación del INPC de los doce meses previos, "
        "salvo acuerdo expreso de las Partes.",
        "**Atraso.** Si el Cliente no cubre el pago en la fecha de vencimiento, los "
        "importes generarán un **interés moratorio del 1.5 % mensual** sobre el saldo "
        "vencido, desde la fecha de vencimiento hasta su pago, sin necesidad de "
        "requerimiento alguno.",
        "**Suspensión por falta de pago.** La falta de pago faculta al Proveedor a "
        "**suspender el acceso al Servicio** sin responsabilidad y sin necesidad de "
        "declaración judicial, previo aviso por correo electrónico con **cinco (5) días "
        "hábiles** de anticipación.",
        "**Terminación por atraso prolongado.** Si el Cliente no paga ni regulariza su "
        "situación dentro de los **treinta (30) días naturales** siguientes a la "
        "suspensión, el Proveedor podrá dar por terminado el Contrato y proceder conforme "
        "a la cláusula Decimocuarta.",
        "**Compensación.** El Cliente no podrá **retener ni compensar** pago alguno por "
        "reclamaciones que no hayan sido reconocidas por escrito por el Proveedor.",
    ]),
    ("p",
     "El Cliente que haya contratado un plazo anual y termine anticipadamente **no tiene "
     "derecho a la devolución de las mensualidades ya pagadas**, salvo lo previsto en la "
     "cláusula Decimocuarta respecto de incumplimientos imputables al Proveedor."),

    ("h", "Nivel de servicio y soporte"),
    ("ol", [
        "**Disponibilidad.** El Proveedor realizará sus mejores esfuerzos para mantener el "
        "Servicio disponible de forma continua, con una meta de disponibilidad mensual de "
        "**noventa y nueve punto cinco por ciento (99.5 %)**, medida sobre el mes "
        "calendario y excluyendo las ventanas de mantenimiento programado y las causas de "
        "fuerza mayor.",
        "**Naturaleza de la meta.** Salvo pacto expreso en el Anexo I, la meta de "
        "disponibilidad es un objetivo de servicio y **no genera penalización económica**. "
        "Si el Cliente requiere un compromiso con penalizaciones, deberá pactarse por "
        "escrito y podrá estar sujeto a un costo adicional.",
        "**Mantenimiento programado.** El Proveedor podrá realizar mantenimientos "
        "programados, procurando notificarlo con al menos **cuarenta y ocho (48) horas** de "
        "anticipación y realizarlo fuera de los horarios de mayor uso.",
        "**Mantenimiento de emergencia.** El Proveedor podrá suspender el Servicio sin "
        "aviso previo cuando sea necesario para preservar la seguridad o la integridad de "
        "los datos, notificándolo tan pronto como sea posible.",
        "**Soporte.** El Proveedor prestará soporte técnico por correo electrónico a "
        f"{CORREO_SOPORTE}, en días hábiles y en horario laboral del centro de México. "
        "Salvo que el Anexo I establezca un compromiso distinto, no hay un tiempo de "
        "respuesta máximo garantizado.",
        "**Dependencia de terceros.** El Servicio se apoya en proveedores de "
        "infraestructura de cómputo en la nube. El Proveedor no responde por las "
        "interrupciones atribuibles a ellos, aunque hará sus mejores esfuerzos por "
        "mitigarlas.",
    ]),
    ("aviso", (
        "La meta de 99.5 % debe coincidir con lo que realmente puedes sostener",
        "Si el Proveedor no puede medir ni sostener esta meta, hay que bajarla o quitarla "
        "antes de firmar. Un compromiso de disponibilidad que no se cumple es un "
        "incumplimiento, y es peor que no haberlo ofrecido. El Anexo I permite pactar una "
        "meta distinta por cliente.",
        "ambar",
    )),

    ("h", "Obligaciones del Cliente"),
    ("p", "El Cliente se obliga a:"),
    ("ol", [
        "Cubrir puntualmente la contraprestación en los términos de la cláusula Séptima.",
        "Proporcionar información veraz y mantenerla actualizada, en especial los datos de "
        "identificación de sus trabajadores y los parámetros fiscales que configure en el "
        "Servicio.",
        "**Suscribir con el Proveedor el Contrato de Encargo de Tratamiento** antes de "
        "cargar datos personales de trabajadores en el Servicio.",
        "Tratar los datos personales de sus trabajadores conforme a la Ley de Datos, "
        "incluyendo la puesta a disposición del aviso de privacidad y la obtención de los "
        "consentimientos que correspondan, en su carácter de Responsable.",
        "Designar a un interlocutor con facultades para dar instrucciones al Proveedor en "
        "materia técnica y de datos personales, y comunicar sus datos de contacto.",
        "**Verificar los resultados del cálculo de nómina y los archivos de exportación** "
        "antes de timbrarlos, entregarlos a su contador o enterar contribuciones.",
        "Mantener los equipos, la red y los dispositivos necesarios para el uso del "
        "Servicio, incluidos los tags NFC.",
        "Custodiar las credenciales de sus usuarios y notificar de inmediato cualquier uso "
        "no autorizado.",
        "Utilizar el Servicio conforme a la cláusula Décima y a la legislación aplicable.",
        "Sacar en paz y a salvo al Proveedor de cualquier reclamación derivada del "
        "tratamiento que el Cliente realice como Responsable de los datos personales.",
    ]),

    ("h", "Uso aceptable"),
    ("p",
     "El Cliente y sus usuarios se obligan a **no**: registrar marcajes de asistencia por "
     "una persona distinta del titular de la tarjeta o del dispositivo, manipular el "
     "registro de jornada, compartir credenciales, realizar ingeniería inversa del "
     "Servicio, acceder a datos de otro cliente, vulnerar las medidas de seguridad, "
     "realizar pruebas de penetración sin autorización previa por escrito, insertar datos "
     "personales sensibles distintos de los previstos en el Anexo A del Contrato de "
     "Encargo, cargar contenido ilícito, revender o sublicenciar el Servicio, ni "
     "automatizar el acceso mediante mecanismos distintos de la interfaz."),
    ("p",
     "El incumplimiento de esta cláusula faculta al Proveedor a **suspender o terminar el "
     "acceso de forma inmediata**, sin reembolso y sin responsabilidad, además de las "
     "acciones legales que procedan. **La fabricación de registros de asistencia es la "
     "causa más grave de terminación**, porque afecta derechos de terceros que no son "
     "parte de este Contrato."),

    ("h", "Propiedad intelectual"),
    ("ol", [
        "**Del Proveedor.** El Servicio, su código fuente, su diseño, su documentación, "
        "sus marcas y sus nombres comerciales son propiedad del Proveedor o de sus "
        "licenciantes. El Cliente **no adquiere ningún derecho sobre ellos**.",
        "**Licencia de uso.** El Proveedor otorga al Cliente una licencia de uso **no "
        "exclusiva, no transferible y no sublicenciable**, limitada a la vigencia de este "
        "Contrato y al número de empleados y usuarios del plan contratado, para el uso "
        "interno del Cliente.",
        "**Del Cliente.** La información que el Cliente carga en el Servicio es y sigue "
        "siendo de su propiedad. El Proveedor no adquiere ningún derecho sobre ella y la "
        "trata únicamente como encargado, conforme al Contrato de Encargo de Tratamiento.",
        "**Formatos de exportación.** El Cliente puede usar libremente los archivos que "
        "descargue con sus propios datos, pero **no puede comercializar los formatos ni "
        "las plantillas de exportación** como producto propio.",
        "**Menciones.** El Proveedor podrá mencionar al Cliente como usuario del Servicio "
        "en materiales de referencia **solo con su autorización previa por escrito** en "
        "cada caso.",
        "**Mejoras.** Cualquier sugerencia, comentario o solicitud de mejora que el "
        "Cliente comunique al Proveedor podrá ser incorporada al Servicio sin "
        "contraprestación ni reconocimiento alguno, sin que ello implique cesión de "
        "información confidencial del Cliente.",
    ]),

    ("h", "Confidencialidad"),
    ("p",
     "Cada Parte se obliga a mantener la confidencialidad de la información de la otra a "
     "la que tenga acceso con motivo de este Contrato, y a no usarla para fines distintos "
     "de su cumplimiento. Esta obligación subsiste por **cinco (5) años** después de la "
     "terminación del Contrato y, de forma **indefinida**, respecto de los datos "
     "personales."),
    ("p",
     "No es información confidencial la que: (i) sea de dominio público sin culpa de la "
     "parte receptora; (ii) ya obrare en su poder lícitamente; (iii) sea revelada por "
     "mandato de autoridad competente, en cuyo caso se notificará a la otra parte; o (iv) "
     "sea desarrollada de forma independiente sin usar la información revelada."),

    ("h", "Protección de datos personales"),
    ("ol", [
        "Las Partes suscribirán el **Contrato de Encargo de Tratamiento de Datos "
        "Personales**, que regula de forma específica: el objeto y las finalidades del "
        "tratamiento, las categorías de datos y de titulares, las obligaciones de cada "
        "Parte, las medidas de seguridad, los encargados adicionales, las transferencias "
        "internacionales, la atención de derechos ARCO, la notificación de vulneraciones "
        "en un plazo de **setenta y dos (72) horas**, la devolución y supresión de los "
        "datos, y la auditoría.",
        "En caso de contradicción entre este Contrato y el de Encargo **respecto del "
        "tratamiento de datos personales**, prevalecerá el de Encargo conforme a la "
        "cláusula Decimosexta.",
        f"El Proveedor pone a disposición del público su aviso de privacidad como "
        f"encargado en {URL_AVISO}, que el Cliente declara conocer.",
        "El Cliente reconoce que el Servicio **no está diseñado para tratar datos "
        "personales sensibles** distintos de los resultados de la valuación de factores de "
        "riesgo psicosocial previstos en el módulo NOM-035, y se obliga a no cargar otros "
        "datos de esa naturaleza sin autorización previa por escrito del Proveedor.",
    ]),

    ("h", "Terminación"),
    ("ol", [
        "**Por vencimiento del plazo.** Conforme a la cláusula Cuarta, salvo que alguna "
        "Parte manifieste lo contrario con treinta (30) días naturales de anticipación.",
        "**Por el Cliente sin causa.** El Cliente podrá dar por terminado el Contrato en "
        "cualquier momento, sin expresión de causa y sin penalidad, mediante aviso por "
        "escrito con **treinta (30) días naturales** de anticipación. En ese caso, el "
        "Cliente deberá cubrir las mensualidades devengadas hasta la fecha de terminación y "
        "**no tendrá derecho a la devolución de las ya pagadas**.",
        "**Por el Proveedor sin causa.** El Proveedor podrá dar por terminado el Contrato "
        "sin causa mediante aviso por escrito con **sesenta (60) días naturales** de "
        "anticipación, y en ese caso **reembolsará al Cliente la parte proporcional de las "
        "mensualidades pagadas por adelantado y no devengadas**, dentro de los treinta (30) "
        "días naturales siguientes.",
        "**Por incumplimiento.** Cualquiera de las Partes podrá dar por terminado el "
        "Contrato si la otra incumple una obligación esencial y no la subsana dentro de los "
        "**diez (10) días hábiles** siguientes a la notificación escrita del "
        "incumplimiento.",
        "**Por incumplimiento grave o de pago.** El Proveedor podrá dar por terminado el "
        "Contrato de forma inmediata en caso de infracción a la cláusula Décima, o "
        "conforme a la cláusula Séptima en caso de atraso prolongado.",
        "**Por descontinuación del Servicio.** Si el Proveedor decide descontinuar el "
        "Servicio, lo notificará con **noventa (90) días naturales** de anticipación, "
        "mantendrá el Servicio en operación durante ese plazo y reembolsará la parte "
        "proporcional de lo no devengado.",
        "**Por insolvencia.** Cualquiera de las Partes podrá dar por terminado el Contrato "
        "si la otra es declarada en concurso mercantil, quiebra o suspensión de pagos, o si "
        "cesa sus operaciones.",
    ]),
    ("p", "**Efectos comunes de la terminación**, cualquiera que sea su causa:"),
    ("ol", [
        "El Proveedor deshabilitará el acceso al Servicio al concluir el plazo "
        "contractual.",
        "Los datos del Cliente permanecerán **disponibles para descarga durante treinta "
        "(30) días naturales** contados a partir de la terminación.",
        "Transcurrido ese plazo, los datos serán **suprimidos**, salvo los que deban "
        "conservarse por mandato legal o para la defensa de un derecho en un "
        "procedimiento, en los términos del Contrato de Encargo.",
        "El Cliente pagará los importes devengados y no cubiertos hasta la fecha de "
        "terminación.",
        "Subsistirán las obligaciones de **confidencialidad**, de **protección de datos "
        "personales**, de **propiedad intelectual** y de **responsabilidad** que por su "
        "naturaleza deban sobrevivir.",
    ]),

    ("h", "Garantías y responsabilidad"),
    ("ol", [
        "**Garantía limitada.** El Proveedor garantiza que el Servicio funciona "
        "sustancialmente conforme a su documentación. Si el Servicio presenta un defecto "
        "que impida su uso conforme a lo descrito, el Proveedor lo corregirá sin costo. Si "
        "no logra corregirlo en un plazo razonable, el Cliente podrá dar por terminado el "
        "Contrato y recibir el reembolso proporcional de lo no devengado. **Esta es la "
        "única garantía** y sustituye a cualquier otra, expresa o implícita.",
        "**Exclusión de garantías.** El Proveedor no garantiza: (i) que el Servicio opere "
        "sin interrupciones o errores; (ii) que los resultados del cálculo de nómina sean "
        "aceptados por el IMSS, el SAT, el INFONAVIT o cualquier autoridad; (iii) que el "
        "Servicio sea compatible con versiones específicas de sistemas de contabilidad de "
        "terceros; ni (iv) que la importación de los archivos en dichos sistemas sea "
        "exitosa sin ajustes, ya que los formatos de importación varían entre versiones y "
        "configuraciones.",
        "**Límite de responsabilidad.** La responsabilidad total acumulada del Proveedor "
        "derivada de este Contrato **no excederá del importe de las contraprestaciones "
        "efectivamente pagadas por el Cliente durante los doce (12) meses anteriores al "
        "hecho que la origine**, o de █████ pesos si el Cliente prefiere un tope fijo, "
        "aplicándose el que resulte menor.",
        "**Exclusión de daños indirectos.** El Proveedor no responde por lucro cesante, "
        "pérdida de oportunidad, daño a la reputación, sanciones administrativas, multas, "
        "recargos, actualizaciones, honorarios de terceros, ni por ningún daño indirecto, "
        "especial, incidental o consecuencial, aun cuando hubiera sido advertido de su "
        "posibilidad.",
        "**Excepciones al límite.** Las limitaciones de esta cláusula **no aplican** en "
        "caso de dolo o mala fe del Proveedor, ni respecto de la obligación de "
        "confidencialidad, ni de la indemnización por infracción a derechos de propiedad "
        "intelectual de terceros.",
        "**Indemnización por terceros.** Si un tercero reclama al Proveedor por el uso que "
        "el Cliente dé al Servicio o por los datos que cargue en él, el Cliente asumirá la "
        "defensa y cubrirá los gastos, costas y condenas que resulten.",
        "**Fuerza mayor.** Ninguna de las Partes responde por incumplimientos derivados de "
        "caso fortuito o fuerza mayor, incluyendo fallas generalizadas de internet, ataques "
        "informáticos de gran escala, actos de autoridad, sismos o interrupciones de los "
        "proveedores de infraestructura.",
        "**Seguros.** El Proveedor no está obligado a contratar un seguro de "
        "responsabilidad civil o cibernética. Si el Cliente requiere que se contrate, "
        "deberá pactarse en el Anexo I y su costo será por cuenta del Cliente.",
    ]),

    ("h", "Prevalencia y orden de aplicación"),
    ("p", "En caso de contradicción entre los documentos que integran la relación "
          "contractual, las Partes reconocen y aceptan el siguiente orden de "
          "prevalencia:"),
    ("ol", [
        "El **presente Contrato de Prestación de Servicios**, incluyendo sus anexos, "
        "respecto de las condiciones comerciales específicas: alcance, plan, "
        "contraprestación, vigencia y nivel de servicio.",
        "El **Contrato de Encargo de Tratamiento de Datos Personales**, respecto de todo "
        "lo relativo al tratamiento de datos personales, las medidas de seguridad, las "
        "vulneraciones y los derechos ARCO.",
        "Los **Términos y Condiciones de Servicio** publicados por el Proveedor, respecto "
        "de las materias no reguladas en los documentos anteriores.",
        "La **documentación técnica** y las guías publicadas por el Proveedor.",
    ]),
    ("p",
     "**Advertencia sobre este orden.** Los Términos y Condiciones son un documento "
     "**unilateral** que el Proveedor puede modificar y que el Cliente acepta al "
     "registrarse. Por esa razón se colocan **por debajo** de los dos contratos "
     "bilaterales: lo que las Partes negociaron y firmaron **no puede quedar modificado "
     "por una actualización unilateral** de los Términos."),
    ("p",
     "Este Contrato, junto con los documentos anteriores, constituye el **acuerdo "
     "completo** entre las Partes respecto del Servicio y sustituye cualquier "
     "entendimiento, propuesta o comunicación previa, verbal o escrita. Si alguna "
     "cláusula resultara inválida o inexigible, las demás conservarán su validez y la "
     "cláusula afectada se interpretará de la forma que mejor refleje la intención de las "
     "Partes."),

    ("h", "Cesión"),
    ("p",
     "El Cliente **no podrá ceder** este Contrato ni los derechos que de él deriven sin la "
     "autorización previa y por escrito del Proveedor."),
    ("p",
     "El Proveedor **podrá ceder** los derechos y obligaciones derivados de este Contrato "
     "a cualquier sociedad que forme parte de su grupo empresarial o a un tercero que "
     "adquiera la totalidad o una parte sustancial de su negocio, siempre que: (i) lo "
     "notifique al Cliente con al menos **treinta (30) días naturales** de anticipación; "
     "(ii) el cesionario asuma por escrito todas las obligaciones del Proveedor; y "
     "(iii) cuando la cesión afecte datos personales, se formalice conforme al Contrato "
     "de Encargo, para que la cadena de encargados no se rompa."),

    ("h", "Notificaciones"),
    ("p",
     "Las notificaciones entre las Partes se realizarán por correo electrónico a las "
     "direcciones señaladas en el Anexo I y, en su defecto, a las siguientes:"),
    ("tabla", (
        ["", "Dirección"],
        [
            ["Proveedor — asuntos legales", CORREO_LEGAL],
            ["Proveedor — soporte técnico", CORREO_SOPORTE],
            ["Proveedor — protección de datos", CORREO_PRIVACIDAD],
            ["Cliente", "El correo registrado en la cuenta"],
        ],
    )),
    ("p",
     "Cualquier cambio en estos datos deberá comunicarse por escrito a la otra Parte "
     "dentro de los **cinco (5) días hábiles** siguientes; en su defecto, las "
     "notificaciones hechas a los datos aquí señalados surtirán plenos efectos."),

    ("h", "Modificaciones"),
    ("p",
     "Cualquier modificación a este Contrato deberá constar por escrito y ser firmada por "
     "los representantes de ambas Partes. **Las actualizaciones que el Proveedor realice "
     "unilateralmente a los Términos y Condiciones no modifican este Contrato**, conforme "
     "a la cláusula Decimosexta."),

    ("h", "Legislación aplicable y jurisdicción"),
    ("p",
     "Este Contrato se rige por las leyes de los Estados Unidos Mexicanos. Serán "
     "aplicables, en lo conducente, el Código de Comercio, el Código Civil Federal, la "
     "Ley Federal de Protección al Consumidor cuando el Cliente tenga el carácter de "
     "consumidor, la Ley Federal de Protección de Datos Personales en Posesión de los "
     "Particulares y la Ley Federal del Trabajo, esta última respecto de las obligaciones "
     "que corresponden al Cliente como patrón."),
    ("p",
     "Para la interpretación y cumplimiento de este Contrato, las Partes se someten a la "
     "jurisdicción de los tribunales competentes de **●**, renunciando a cualquier otro "
     "fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros."),
    ("p",
     "Las Partes intentarán resolver de buena fe cualquier controversia mediante "
     "negociación directa dentro de los **treinta (30) días naturales** siguientes a la "
     "notificación escrita de la controversia, antes de acudir a cualquier instancia."),
]

# =====================================================================
# Anexos
# =====================================================================
ANEXOS: list[tuple[str, Any]] = [
    ("h", "Anexo I. Datos del servicio contratado"),
    ("p",
     "Este anexo es parte integrante del Contrato. Sin él no hay plan, precio ni vigencia "
     "determinados."),
    ("tabla", (
        ["Concepto", "Datos"],
        [
            ["Plan contratado", "● (Básico / Contable / Despacho)"],
            ["Clave del plan en el sistema", "● (basico / pro / business)"],
            ["Contraprestación mensual", "$● MXN más IVA"],
            ["Número máximo de empleados activos", "●"],
            ["Número de usuarios administrativos incluidos", "●"],
            ["Fecha de inicio de la vigencia", "●"],
            ["Vigencia inicial", "● (por omisión, 12 meses)"],
            ["Fecha del primer cobro", "●"],
            ["Periodicidad del cobro", "● (por omisión, mensual anticipado)"],
            ["Medio de pago", "● (por omisión, cobro recurrente a tarjeta)"],
            ["Meta de disponibilidad mensual", "● (por omisión, 99.5 %)"],
            ["Compromiso de tiempo de respuesta de soporte", "● o “sin compromiso específico”"],
            ["Penalización por incumplimiento de disponibilidad", "● o “no aplica”"],
            ["Seguro de responsabilidad requerido", "● o “no requerido”"],
            ["Tope fijo de responsabilidad (si aplica)", "$● MXN o “aplicar el de 12 meses”"],
        ],
    )),
    ("h2", "Datos de contacto del Cliente para notificaciones"),
    ("tabla", (
        ["Concepto", "Datos"],
        [
            ["Razón social o nombre", "●"],
            ["RFC", "●"],
            ["Domicilio", "●"],
            ["Representante legal", "●"],
            ["Cargo", "●"],
            ["Correo para notificaciones", "●"],
            ["Teléfono", "●"],
            ["Interlocutor técnico (nombre y correo)", "●"],
            ["Interlocutor en protección de datos (nombre y correo)", "●"],
        ],
    )),

    ("h", "Anexo II. Funciones incluidas por plan"),
    ("p",
     "Las funciones marcadas con ✓ están incluidas en el plan. Este anexo debe coincidir "
     "con el catálogo de planes del sistema y con lo publicado en el sitio."),
    ("tabla", (
        ["Función", "Básico", "Contable", "Despacho"],
        [
            ["Marcaje por NFC en puntos ilimitados", "✓", "✓", "✓"],
            ["Jornadas conformes a la LFT", "✓", "✓", "✓"],
            ["Reportes de asistencia (CSV)", "✓", "✓", "✓"],
            ["Aviso de privacidad y consentimientos", "✓", "✓", "✓"],
            ["Exportación de nómina en CSV genérico", "✓", "✓", "✓"],
            ["Cálculo de nómina (ISR, IMSS, SAR, INFONAVIT)", "—", "✓", "✓"],
            ["Exportación a CONTPAQi y Aspel", "—", "✓", "✓"],
            ["Pólizas contables con catálogo de cuentas", "—", "✓", "✓"],
            ["Valuación de riesgos psicosociales (NOM-035)", "—", "✓", "✓"],
            ["Multi-empresa y multi-sucursal", "—", "—", "✓"],
            ["Panel de clientes para el contador", "—", "—", "✓"],
            ["Descuentos por empleado", "—", "—", "✓"],
            ["Soporte prioritario", "—", "—", "✓"],
        ],
    )),

    ("h", "Anexo III. Módulos fuera del alcance"),
    ("p",
     "Para evitar expectativas equivocadas, se deja constancia de que **no forman parte "
     "del Servicio contratado** las siguientes funciones, que el Proveedor tiene en su "
     "ruta de producto pero que **no están comprometidas** por este Contrato:"),
    ("ul", [
        "Timbrado del CFDI de nómina 4.0 e integración con un Proveedor Autorizado de "
        "Certificación.",
        "Cálculo de aguinaldo, prima vacacional, finiquito y liquidación.",
        "Ajuste anual del ISR de los trabajadores.",
        "Cuota patronal adicional del régimen de la Ley 97 del IMSS.",
        "Integración por interfaz de programación con sistemas de contabilidad de terceros.",
        "Aplicación móvil nativa.",
    ]),
    ("aviso", (
        "Este anexo protege a las dos Partes",
        "Si el Cliente contrata esperando el timbrado y este anexo no existe, la primera "
        "factura sin CFDI de nómina se convierte en un conflicto. Al firmarlo, el Cliente "
        "sabe con exactitud qué recibe y el Proveedor puede trabajar en la ruta sin "
        "presión de un compromiso que no adquirió.",
        "azul",
    )),
]

# =====================================================================
# Cierre
# =====================================================================
CIERRE: list[tuple[str, Any]] = [
    ("p",
     f"**Versión:** {VERSION} · Leído que fue el presente Contrato por las Partes, lo "
     "firman por duplicado ante dos testigos en la ciudad de ●, el día ● de ● de ●●."),
]
