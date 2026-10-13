"""
FUENTE ÚNICA de los Términos y Condiciones de Chekdor.

Este archivo contiene el texto como DATOS estructurados, no como texto
formateado. De aquí se generan dos salidas que deben decir exactamente lo
mismo:

    python docs/legal/terminos/generar_docx.py   -> .docx para revisión y firma
    python docs/legal/terminos/generar_tsx.py    -> página pública /terminos

La alternativa (mantener el Word y la página por separado) garantiza que en
tres meses digan cosas distintas. Con una sola fuente, no pueden divergir.

Formato de los bloques:
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
TITULO = "TÉRMINOS Y CONDICIONES DE SERVICIO"
SUBTITULO = "Chekdor · Sistema de control de asistencia, cálculo de nómina y exportación contable"
VERSION = "1.0"
VIGENTE_DESDE = "● de ● de ●●"
PROVEEDOR = "Chekdor"
CORREO_LEGAL = "legal@chekdor.com.mx"
CORREO_SOPORTE = "soporte@chekdor.com.mx"
CORREO_PRIVACIDAD = "privacidad@chekdor.com.mx"
URL_TERMINOS = "/terminos"
URL_AVISO = "/privacidad-encargado"
URL_ENCARGO = "docs/legal/Contrato_Encargo_Tratamiento_Chekdor.docx"

# =====================================================================
# Bloques
# =====================================================================
BLOQUES: list[tuple[str, Any]] = [
    # -----------------------------------------------------------------
    ("aviso", (
        "DOCUMENTO EN REVISIÓN — elimina este recuadro al publicar",
        "Los campos marcados con **●** deben completarse antes de publicar: razón social o "
        "nombre, RFC, domicilio, correos de contacto reales, la fecha de entrada en vigor y "
        "los precios vigentes. Además, revisa el **aviso sobre cobros**: hoy el Servicio no "
        "tiene pasarela de pago ni facturación automática, y estos Términos no deben "
        "presentar como cobrable algo que no lo es.",
        "rojo",
    )),

    # ============================ 1 ==================================
    ("h", "Partes y objeto"),
    ("p",
     "Los presentes Términos y Condiciones de Servicio (los __“Términos”__) regulan el "
     "acceso y uso de la plataforma **Chekdor** (el __“Servicio”__), un sistema en línea "
     "para el registro de asistencia laboral mediante tecnología NFC, el cálculo de nómina "
     "conforme a la Ley Federal del Trabajo y la generación de archivos de exportación "
     "contable."),
    ("p",
     "El Servicio es operado por **Chekdor** (el __“Proveedor”__), con Registro Federal de "
     "Contribuyentes ● y domicilio en ●."),
    ("p",
     "El __“Cliente”__ es la persona física o moral que crea una cuenta y contrata el "
     "Servicio para administrar la asistencia y la nómina de sus propios trabajadores. "
     "Quien acepta estos Términos **en nombre de una empresa declara contar con facultades "
     "suficientes** para obligarla."),
    ("p",
     "El Proveedor y el Cliente se denominarán conjuntamente las __“Partes”__. Los "
     "presentes Términos, junto con el **Contrato de Encargo de Tratamiento de Datos "
     "Personales** que el Cliente suscriba, forman el acuerdo completo entre las Partes "
     "respecto del Servicio."),

    # ============================ 2 ==================================
    ("h", "Aceptación"),
    ("p",
     "La aceptación de estos Términos ocurre cuando el Cliente realiza cualquiera de los "
     "siguientes actos:"),
    ("ol", [
        "Se registra y crea una cuenta en el Servicio.",
        "Marca la casilla de aceptación al momento del registro.",
        "Utiliza el Servicio de forma continuada después de que el Proveedor le haya "
        "notificado una actualización de estos Términos.",
    ]),
    ("p",
     "**Si el Cliente no está de acuerdo con estos Términos, no debe registrarse ni "
     "utilizar el Servicio.** El uso continuado después de una actualización implica su "
     "aceptación."),
    ("p",
     "La aceptación tiene efectos de firma electrónica conforme a los artículos 89 a 114 "
     "del Código de Comercio y al artículo 1803 del Código Civil Federal. El Proveedor "
     "conserva el registro de la aceptación, con la fecha, la hora, la dirección IP y el "
     "agente de usuario del dispositivo."),

    # ============================ 3 ==================================
    ("h", "Capacidad y representación"),
    ("p",
     "El Cliente declara ser mayor de edad y contar con capacidad legal para obligarse. "
     "Cuando el registro lo realice una persona en representación de una empresa, declara "
     "tener facultades suficientes para aceptar estos Términos en su nombre y para obligarla "
     "a pagar las contraprestaciones que correspondan."),
    ("p",
     "El Cliente que se registre como **despacho contable o asesor** y administre cuentas de "
     "varios clientes finales declara contar con la autorización de cada uno de ellos para "
     "cargar y tratar su información en el Servicio. El Proveedor no verifica esa "
     "autorización y queda relevado de responsabilidad por su ausencia."),

    # ============================ 4 ==================================
    ("h", "Descripción del Servicio"),
    ("p", "El Servicio incluye, según el plan contratado, las siguientes funciones:"),
    ("ul", [
        "**Registro de asistencia por NFC:** el trabajador acerca su tarjeta o su teléfono a "
        "un tag NFC o a un dispositivo configurado como punto de marcaje.",
        "**Cálculo de jornadas conforme a la LFT:** tope de jornada diaria, reparto semanal "
        "del tiempo extraordinario al doble y al triple, y prima dominical.",
        "**Cálculo de nómina:** percepciones, deducciones, exenciones, retención de ISR con "
        "subsidio al empleo, cuotas obrero-patronales del IMSS, aportaciones al SAR e "
        "INFONAVIT.",
        "**Exportación contable:** archivos de nómina y pólizas contables para su "
        "importación en sistemas de contabilidad, y reportes de asistencia y jornadas.",
        "**Módulos de cumplimiento:** gestión del aviso de privacidad y de los "
        "consentimientos, atención de solicitudes de derechos ARCO, y valuación de factores "
        "de riesgo psicosocial de la NOM-035.",
        "**Soporte técnico** por los canales indicados en la sección 13.",
    ]),
    ("p",
     "El detalle de cada plan y las funciones que incluye se publican en la página de "
     "precios del sitio."),

    # ============================ 5 ==================================
    ("h", "Lo que el Servicio NO hace"),
    ("p",
     "Para evitar cualquier expectativa equivocada, el Cliente reconoce y acepta que el "
     "Servicio **no** realiza lo siguiente:"),
    ("ol", [
        "**No timbra CFDI de nómina** ni de ningún otro tipo. El Servicio calcula y genera "
        "los archivos, pero el timbrado ante el Servicio de Administración Tributaria "
        "requiere un Proveedor Autorizado de Certificación, que el Cliente debe contratar "
        "por su cuenta.",
        "**No presenta declaraciones ni paga contribuciones.** El entero de ISR, de cuotas "
        "del IMSS, de aportaciones al SAR y al INFONAVIT es responsabilidad exclusiva del "
        "Cliente.",
        "**No sustituye la asesoría contable, fiscal ni jurídica.** El Proveedor no actúa "
        "como contador público, asesor fiscal ni abogado del Cliente.",
        "**No se integra por API con sistemas de contabilidad** de terceros. La entrega de "
        "información se realiza mediante archivos que el Cliente descarga e importa en sus "
        "propios sistemas.",
        "**No verifica la veracidad de los datos** que el Cliente captura. El Proveedor "
        "valida formatos, pero no la exactitud de la información.",
        "**No realiza la valuación oficial de factores de riesgo psicosocial.** El "
        "instrumento y los umbrales que utiliza el módulo correspondiente son orientativos y "
        "no son el texto oficial de la Guía de Referencia I de la NOM-035.",
    ]),
    ("aviso", (
        "El cálculo de nómina es una herramienta, no un dictamen",
        "El Servicio aplica las tasas, tarifas y parámetros configurados y los vigentes en "
        "sus catálogos. **El Cliente, y su contador, son responsables de validar los "
        "resultados antes de timbrar o de pagar cualquier cantidad.** El Proveedor muestra "
        "en la interfaz cuándo está utilizando un valor de respaldo en lugar del cargado en "
        "la base de datos, y publica la fuente oficial de cada parámetro en su "
        "documentación. Verificar esos valores es obligación del Cliente.",
        "ambar",
    )),

    # ============================ 6 ==================================
    ("h", "Periodo de prueba"),
    ("p",
     "El Proveedor ofrece un **periodo de prueba gratuito de catorce (14) días naturales** "
     "contados a partir de la creación de la cuenta. Durante ese periodo el Cliente puede "
     "usar las funciones del plan que seleccione, sin necesidad de proporcionar datos de "
     "pago."),
    ("p",
     "Al concluir el periodo de prueba, si el Cliente no contrata un plan de pago, el "
     "Proveedor podrá suspender el acceso o degradar la cuenta a las funciones gratuitas "
     "que, en su caso, ofrezca. **El Proveedor no elimina la información al terminar la "
     "prueba** sin antes notificarlo, para permitir su descarga."),
    ("p",
     "El periodo de prueba es **uno por Cliente**. El Proveedor podrá negarlo o "
     "suspenderlo cuando detecte registros sucesivos de una misma persona o empresa con el "
     "fin de extenderlo indefinidamente."),

    # ============================ 7 ==================================
    ("h", "Precios y planes"),
    ("p", "Los planes vigentes y sus precios publicados son:"),
    ("tabla", (
        ["Plan", "Precio mensual", "Empleados incluidos"],
        [
            ["Básico", "$299.00 MXN", "Hasta 10"],
            ["Contable", "$599.00 MXN", "Hasta 30"],
            ["Despacho", "$1,299.00 MXN", "Hasta 100 por empresa"],
        ],
    )),
    ("p",
     "Los precios se expresan en pesos mexicanos y **no incluyen el Impuesto al Valor "
     "Agregado**, que se sumará en su caso conforme a la legislación aplicable. Los precios "
     "pueden actualizarse conforme a la sección 15."),
    ("aviso", (
        "AVISO SOBRE COBROS — elimina este recuadro cuando exista la pasarela de pago",
        "Hoy el Servicio **no tiene implementada una pasarela de pago ni la emisión "
        "automática de comprobantes fiscales**. Mientras esa circunstancia subsista, estos "
        "Términos no deben presentarse al público como una oferta de cobro: el Servicio se "
        "presta de forma gratuita y los planes publicados son una referencia de los precios "
        "previstos para cuando la facturación esté disponible. Antes de activar cobros hay "
        "que: (i) implementar la pasarela y el registro de las suscripciones, (ii) definir "
        "el procedimiento de facturación y quién lo opera, (iii) sustituir esta sección por "
        "la sección de facturación correspondiente, y (iv) **actualizar la página de precios "
        "de la landing**, que hoy presenta los planes como comprables y no lo son.",
        "rojo",
    )),

    # ============================ 8 ==================================
    ("h", "Facturación, pagos y mora"),
    ("p",
     "Esta sección se activará cuando el Proveedor habilite el cobro y se lo comunique al "
     "Cliente por los medios de la sección 16. A partir de ese momento aplicará lo "
     "siguiente:"),
    ("ol", [
        "La contratación de un plan de pago se formaliza por un periodo inicial de **doce "
        "(12) meses**, que se prorroga automáticamente por periodos iguales salvo aviso en "
        "contrario de cualquiera de las Partes con **treinta (30) días naturales** de "
        "anticipación.",
        "El cobro es **mensual y anticipado** y se realiza mediante el medio de pago "
        "registrado por el Cliente.",
        "El Proveedor emitirá el **comprobante fiscal digital** que corresponda por cada "
        "cobro. El Cliente es responsable de proporcionar correctamente sus datos fiscales y "
        "de revisar el comprobante dentro de los cinco (5) días hábiles siguientes a su "
        "recepción.",
        "La falta de pago faculta al Proveedor a **suspender el acceso al Servicio** sin "
        "responsabilidad y sin necesidad de declaración judicial, previo aviso por correo "
        "electrónico con cinco (5) días hábiles de anticipación.",
        "Si el Cliente no paga dentro de los **treinta (30) días naturales** siguientes a la "
        "suspensión, el Proveedor podrá dar por terminado el contrato y proceder conforme a "
        "la sección 14.",
        "El Cliente no podrá **retener ni compensar** pago alguno por reclamaciones que no "
        "hayan sido reconocidas por escrito por el Proveedor.",
        "Los importes no pagados podrán generar un interés moratorio del **1.5 % mensual** "
        "sobre el saldo vencido, desde la fecha de vencimiento hasta su pago.",
    ]),
    ("p",
     "El Cliente que contrató un plan anual y da por terminado el contrato antes de su "
     "vencimiento **no tiene derecho a la devolución de las mensualidades ya pagadas**, "
     "salvo lo previsto en la sección 14 respecto de incumplimientos imputables al "
     "Proveedor."),

    # ============================ 9 ==================================
    ("h", "Cuentas, usuarios y seguridad"),
    ("ol", [
        "La cuenta pertenece al Cliente. El Proveedor entrega credenciales a las personas "
        "que el Cliente designe, con los roles que este determine.",
        "**El Cliente es responsable de la custodia de las credenciales** de sus usuarios y "
        "de todos los actos realizados con ellas. Las credenciales son personales e "
        "intransferibles.",
        "El Cliente se obliga a notificar de inmediato al Proveedor cualquier uso no "
        "autorizado de una cuenta o cualquier sospecha de compromiso de credenciales, a "
        f"través de {CORREO_SOPORTE}.",
        "El Cliente administra a sus usuarios: puede crear, modificar y desactivar perfiles, "
        "y debe hacerlo cuando una persona deja de prestar servicios para él.",
        "El Proveedor podrá **suspender una cuenta** cuando detecte un uso que infrinja "
        "estos Términos, un riesgo de seguridad, o cuando lo requiera una autoridad "
        "competente, notificándolo al Cliente tan pronto como sea posible.",
    ]),

    # =========================== 10 ==================================
    ("h", "Obligaciones del Cliente"),
    ("p", "El Cliente se obliga a:"),
    ("ol", [
        "Tratar los datos personales de sus trabajadores conforme a la LFPDPPP, incluyendo "
        "la puesta a disposición del aviso de privacidad y la obtención de los "
        "consentimientos que correspondan. **El Cliente es el responsable de los datos "
        "personales** que carga en el Servicio; el Proveedor actúa como encargado.",
        "Suscribir con el Proveedor el **Contrato de Encargo de Tratamiento** antes de "
        "cargar datos personales de trabajadores en el Servicio.",
        "Verificar los resultados del cálculo de nómina y los archivos de exportación "
        "**antes** de timbrarlos, entregarlos a su contador o enterar contribuciones.",
        "Proporcionar información veraz y mantenerla actualizada, en especial los datos de "
        "identificación de sus trabajadores y los parámetros fiscales que configure.",
        "Utilizar el Servicio conforme a la sección 11 y a la legislación aplicable.",
        "Contar con las autorizaciones necesarias cuando administre cuentas de terceros, "
        "conforme a la sección 3.",
    ]),

    # =========================== 11 ==================================
    ("h", "Uso aceptable y prohibiciones"),
    ("p", "El Cliente y sus usuarios se obligan a **no**:"),
    ("ol", [
        "Registrar marcajes de asistencia por una persona distinta del titular de la tarjeta "
        "o del dispositivo, o manipular el registro de jornada de cualquier forma. El "
        "registro de asistencia debe reflejar la realidad; su alteración puede constituir "
        "una violación a la Ley Federal del Trabajo y, en su caso, un delito.",
        "Compartir credenciales entre personas, o usar la cuenta para dar servicio a "
        "terceros no autorizados. Un despacho solo puede administrar las cuentas de sus "
        "propios clientes.",
        "Realizar ingeniería inversa, descompilar, desensamblar o intentar obtener el código "
        "fuente del Servicio, salvo en la medida en que la ley lo permita de forma "
        "irrenunciable.",
        "Acceder a datos de otro cliente, o intentar vulnerar las medidas de seguridad, los "
        "controles de acceso o los mecanismos de aislamiento del Servicio.",
        "Realizar pruebas de penetración, escaneos de vulnerabilidades o pruebas de carga "
        "sobre el Servicio **sin autorización previa por escrito** del Proveedor.",
        "Insertar en el Servicio datos personales sensibles distintos de los previstos en su "
        "Anexo A, en particular datos de salud no contemplados, información genética, "
        "creencias religiosas, opiniones políticas, preferencia sexual o datos de niñas, "
        "niños y adolescentes.",
        "Cargar contenido ilícito o que infrinja derechos de terceros.",
        "Utilizar el Servicio para enviar comunicaciones no solicitadas o para actividades "
        "de mercadotecnia dirigidas a terceros.",
        "Revender, sublicenciar o poner el Servicio a disposición de terceros como si fuera "
        "propio, salvo autorización expresa por escrito.",
        "Automatizar el acceso al Servicio mediante robots, recolectores o mecanismos "
        "distintos de la interfaz, salvo las integraciones autorizadas.",
    ]),
    ("p",
     "El incumplimiento de esta sección faculta al Proveedor a **suspender o terminar el "
     "acceso de forma inmediata**, sin reembolso y sin responsabilidad, además de las "
     "acciones legales que procedan. La fabricación de registros de asistencia es la causa "
     "más grave de suspensión, porque afecta derechos de terceros que no son parte de estos "
     "Términos."),

    # =========================== 12 ==================================
    ("h", "Datos, propiedad y protección de datos personales"),
    ("ol", [
        "**Los datos son del Cliente.** La información que el Cliente carga en el Servicio "
        "—incluyendo los datos personales de sus trabajadores, los marcajes, las jornadas y "
        "los recibos de nómina— es y sigue siendo de su propiedad. El Proveedor no adquiere "
        "ningún derecho sobre ella.",
        "El Proveedor trata esos datos **únicamente como encargado** y conforme a las "
        "instrucciones del Cliente, en los términos del Contrato de Encargo de Tratamiento y "
        f"del aviso de privacidad publicado en {URL_AVISO}.",
        "El Proveedor **no utiliza los datos del Cliente** para finalidades propias, "
        "publicidad, prospección comercial, elaboración de perfiles comerciales ni "
        "entrenamiento de modelos de inteligencia artificial, y no los vende ni los cede a "
        "terceros.",
        "El Cliente puede **exportar** sus datos en cualquier momento mediante las funciones "
        "de descarga del Servicio (reportes en CSV y archivos de nómina y pólizas).",
        "Al término del contrato, el Proveedor **conserva los datos disponibles para "
        "descarga durante treinta (30) días naturales** y después los **suprime**, salvo "
        "aquellos que deba conservar por mandato legal. El detalle está en el Contrato de "
        "Encargo de Tratamiento.",
        "El Proveedor podrá generar **estadísticas agregadas y disociadas** —sin que sea "
        "posible identificar al Cliente ni a ninguna persona— para fines de mejora del "
        "Servicio y de comunicación de métricas. Estas estadísticas no constituyen datos "
        "personales.",
    ]),
    # NOTA INTERNA (no se imprime): no prometas en estos Términos una función
    # de autocancelación que el producto no tiene. El Cliente la buscará en el
    # panel y no la encontrará. Cuando exista, sustituye este recuadro por la
    # sección de cancelación desde el panel.
    ("aviso", (
        "Cómo eliminar la cuenta",
        "El Servicio **todavía no expone una función de eliminación de cuenta desde el "
        "panel**. Mientras eso no exista, el Cliente debe solicitar la eliminación "
        f"escribiendo a {CORREO_PRIVACIDAD}. El Proveedor confirmará la recepción dentro de "
        "los tres (3) días hábiles siguientes y ejecutará la eliminación conforme a los "
        "plazos del Contrato de Encargo de Tratamiento: treinta (30) días naturales de "
        "disponibilidad para descarga y quince (15) días naturales para la supresión.",
        "ambar",
    )),

    # =========================== 13 ==================================
    ("h", "Disponibilidad, soporte y mantenimiento"),
    ("ol", [
        "El Proveedor realiza sus mejores esfuerzos para mantener el Servicio disponible de "
        "forma continua. **El Servicio se presta “como está” y “según disponibilidad”**, sin "
        "garantía de ausencia de interrupciones o errores.",
        "El Proveedor **no garantiza un porcentaje de disponibilidad** ni ofrece un Acuerdo "
        "de Niveles de Servicio (SLA) con penalizaciones. Si el Cliente requiere un "
        "compromiso de disponibilidad, deberá pactarlo por escrito y podrá estar sujeto a un "
        "costo adicional.",
        "El Proveedor podrá realizar **mantenimientos programados** y suspender "
        "temporalmente el Servicio, procurando notificarlo con antelación y realizarlo fuera "
        "de los horarios de mayor uso.",
        "El Proveedor podrá realizar **mantenimientos de emergencia** sin aviso previo "
        "cuando sea necesario para preservar la seguridad o la integridad de los datos.",
        "El Servicio depende de proveedores de infraestructura de cómputo en la nube "
        "indicados en el Contrato de Encargo de Tratamiento. El Proveedor no responde por "
        "las interrupciones atribuibles a ellos, aunque hará sus mejores esfuerzos por "
        "mitigarlas.",
        f"El **soporte** se presta por correo electrónico en {CORREO_SOPORTE}, en días "
        "hábiles y en horario laboral del centro de México. El Proveedor no se compromete a "
        "un tiempo de respuesta máximo, salvo lo que se pacte por escrito en un plan "
        "específico.",
        "El Proveedor podrá **modificar, añadir o retirar funciones** del Servicio. Si la "
        "modificación afecta de forma sustancial una función contratada, lo notificará al "
        "Cliente con al menos **treinta (30) días naturales** de anticipación y el Cliente "
        "podrá dar por terminado el contrato sin penalidad conforme a la sección 14.",
    ]),

    # =========================== 14 ==================================
    ("h", "Vigencia, terminación y efectos"),
    ("ol", [
        "Estos Términos están vigentes desde la fecha de aceptación y mientras el Cliente "
        "utilice el Servicio.",
        "**El Cliente puede dar por terminado el contrato en cualquier momento**, sin "
        "expresión de causa y sin penalidad, mediante aviso por escrito con **treinta (30) "
        "días naturales** de anticipación a la dirección de la sección 16. Si mantiene un "
        "plan de pago, la terminación surte efectos al concluir el periodo mensual en curso.",
        "**El Proveedor puede dar por terminado el contrato**: (i) por incumplimiento del "
        "Cliente, con aviso y un plazo de diez (10) días hábiles para subsanarlo; (ii) de "
        "forma inmediata, en caso de infracción a la sección 11; y (iii) sin causa, con "
        "aviso de **sesenta (60) días naturales**.",
        "**El Proveedor puede terminar el contrato de forma inmediata** si el Cliente deja "
        "de pagar conforme a la sección 8, si el Cliente cae en un procedimiento de "
        "insolvencia, o si el Proveedor decide **descontinuar el Servicio**, en cuyo caso lo "
        "notificará con **noventa (90) días naturales** de anticipación y mantendrá el "
        "Servicio en operación durante ese plazo.",
        "Al término del contrato, por cualquier causa: (i) el Proveedor deshabilitará el "
        "acceso al Servicio; (ii) los datos permanecerán disponibles para descarga durante "
        "**treinta (30) días naturales**; y (iii) transcurrido ese plazo, serán suprimidos "
        "conforme al Contrato de Encargo de Tratamiento.",
        "**Si el Proveedor termina el contrato sin causa o descontinúa el Servicio**, "
        "reembolsará al Cliente la parte proporcional de las mensualidades pagadas por "
        "adelantado y no devengadas, dentro de los treinta (30) días naturales siguientes.",
        "Subsistirán a la terminación las obligaciones de **confidencialidad**, de "
        "**protección de datos personales**, de **propiedad intelectual** y de "
        "**responsabilidad** que por su naturaleza deban sobrevivir.",
    ]),

    # =========================== 15 ==================================
    ("h", "Modificaciones a los Términos"),
    ("p",
     "El Proveedor podrá modificar estos Términos por cambios en el Servicio, en la "
     "legislación aplicable o en sus prácticas comerciales. Las modificaciones se "
     "notificarán por correo electrónico a la dirección registrada por el Cliente y se "
     "publicarán en esta misma dirección con su fecha de actualización, con al menos "
     "**quince (15) días naturales** de anticipación a su entrada en vigor."),
    ("p",
     "Si el Cliente no está de acuerdo con la modificación, podrá dar por terminado el "
     "contrato sin penalidad dentro de ese plazo, conforme a la sección 14. **El uso del "
     "Servicio después de la entrada en vigor implica la aceptación** de los Términos "
     "modificados."),
    ("p",
     "El Proveedor **no modificará estos Términos para ampliar las finalidades del "
     "tratamiento de datos personales** sin la autorización del Cliente, conforme al "
     "Contrato de Encargo de Tratamiento."),

    # =========================== 16 ==================================
    ("h", "Notificaciones"),
    ("p",
     "Las notificaciones entre las Partes se realizarán por correo electrónico a las "
     "siguientes direcciones:"),
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
     "El Cliente es responsable de mantener actualizado su correo electrónico de contacto. "
     "Las notificaciones enviadas a la dirección registrada surten plenos efectos desde el "
     "día hábil siguiente a su envío."),

    # =========================== 17 ==================================
    ("h", "Propiedad intelectual"),
    ("ol", [
        "El Servicio, su código fuente, su diseño, su documentación, sus marcas y sus "
        "nombres comerciales son propiedad del Proveedor o de sus licenciantes. **El Cliente "
        "no adquiere ningún derecho sobre ellos**, salvo la licencia de uso limitada, "
        "revocable e intransferible necesaria para utilizar el Servicio en los términos de "
        "estos Términos.",
        "El Proveedor otorga al Cliente una licencia de uso **no exclusiva, no transferible y "
        "no sublicenciable**, limitada a la duración del contrato y al número de empleados y "
        "usuarios del plan contratado.",
        "El Cliente **no adquiere derecho alguno sobre los archivos de exportación en cuanto "
        "a su formato**: puede usarlos libremente con sus datos, pero no puede comercializar "
        "los formatos ni las plantillas de exportación como producto propio.",
        "El Cliente autoriza al Proveedor a mencionar su nombre y su logotipo como cliente "
        "en materiales de referencia, **solo con su autorización previa por escrito** en cada "
        "caso.",
    ]),

    # =========================== 18 ==================================
    ("h", "Garantías y limitación de responsabilidad"),
    ("ol", [
        "**Garantía limitada.** El Proveedor garantiza que el Servicio funciona "
        "sustancialmente conforme a su documentación. Si el Servicio presenta un defecto que "
        "impida su uso conforme a lo descrito, el Proveedor lo corregirá sin costo. Si no "
        "logra corregirlo en un plazo razonable, el Cliente podrá dar por terminado el "
        "contrato y recibir el reembolso proporcional de lo no devengado. **Esta es la única "
        "garantía** y sustituye a cualquier otra, expresa o implícita.",
        "**Exclusión de garantías.** El Proveedor no garantiza: (i) que el Servicio opere "
        "sin interrupciones o errores; (ii) que los resultados del cálculo de nómina sean "
        "aceptados por el IMSS, el SAT, el INFONAVIT o cualquier autoridad; (iii) que el "
        "Servicio sea compatible con versiones específicas de sistemas de contabilidad de "
        "terceros; ni (iv) que la importación de los archivos en dichos sistemas sea exitosa "
        "sin ajustes, ya que los formatos de importación varían entre versiones y "
        "configuraciones.",
        "**Límite de responsabilidad.** La responsabilidad total acumulada del Proveedor "
        "derivada de estos Términos o del uso del Servicio **no excederá del importe de las "
        "contraprestaciones efectivamente pagadas por el Cliente durante los doce (12) meses "
        "anteriores al hecho que la origine**. Mientras el Servicio se preste de forma "
        "gratuita, ese límite será de **cero pesos**.",
        "**Exclusión de daños indirectos.** El Proveedor no responde por lucro cesante, "
        "pérdida de oportunidad, daño a la reputación, sanciones administrativas, multas, "
        "recargos, actualizaciones, honorarios de terceros, ni por ningún daño indirecto, "
        "especial, incidental o consecuencial, aun cuando hubiera sido advertido de su "
        "posibilidad.",
        "**Excepciones al límite.** Las limitaciones de esta sección **no aplican** en caso "
        "de dolo o mala fe del Proveedor, ni respecto de la obligación de "
        "confidencialidad, ni de la indemnización por infracción a derechos de propiedad "
        "intelectual de terceros.",
        "**Responsabilidad del Cliente.** El Cliente responderá por los daños que cause al "
        "Proveedor o a terceros por el incumplimiento de estos Términos, por la falta de "
        "veracidad de los datos que cargue, por el uso indebido del Servicio y por el "
        "tratamiento que realice de los datos personales como responsable de ellos. El "
        "Cliente **saca en paz y a salvo** al Proveedor frente a cualquier reclamación de "
        "sus trabajadores o de terceros derivada de esos hechos.",
        "**Indemnización por terceros.** Si un tercero reclama al Proveedor por el uso que "
        "el Cliente dé al Servicio o por los datos que cargue en él, el Cliente asumirá la "
        "defensa y cubrirá los gastos, costas y condenas que resulten.",
        "**Fuerza mayor.** Ninguna de las Partes responde por incumplimientos derivados de "
        "caso fortuito o fuerza mayor, incluyendo fallas generalizadas de internet, ataques "
        "informáticos de gran escala, actos de autoridad, sismos o interrupciones de los "
        "proveedores de infraestructura.",
    ]),

    # =========================== 19 ==================================
    ("h", "Confidencialidad"),
    ("p",
     "Las Partes se obligan a mantener la confidencialidad de la información a la que "
     "tengan acceso con motivo del Servicio, y a no usarla para fines distintos del "
     "cumplimiento de estos Términos. Esta obligación subsiste por **cinco (5) años** "
     "después de la terminación del contrato, y de forma indefinida respecto de los datos "
     "personales."),
    ("p",
     "No es información confidencial la que: (i) sea de dominio público sin culpa de la "
     "parte receptora; (ii) ya obrare en su poder lícitamente antes de recibirla; (iii) sea "
     "revelada por mandato de autoridad competente, en cuyo caso se notificará a la otra "
     "parte; o (iv) sea desarrollada de forma independiente sin usar la información "
     "revelada."),

    # =========================== 20 ==================================
    ("h", "Cesión"),
    ("p",
     "El Cliente **no podrá ceder** estos Términos ni los derechos que de ellos deriven sin "
     "la autorización previa y por escrito del Proveedor."),
    ("p",
     "El Proveedor **podrá ceder** los derechos y obligaciones derivados de estos Términos "
     "a cualquier sociedad que forme parte de su grupo empresarial o a un tercero que "
     "adquiera la totalidad o una parte sustancial de su negocio, siempre que: (i) lo "
     "notifique al Cliente con al menos **treinta (30) días naturales** de anticipación; "
     "(ii) el cesionario asuma por escrito todas las obligaciones del Proveedor; y "
     "(iii) cuando la cesión afecte datos personales, se formalice conforme al Contrato de "
     "Encargo de Tratamiento, para que la cadena de encargados no se rompa."),

    # =========================== 21 ==================================
    ("h", "Prevalencia y acuerdo completo"),
    ("p",
     "En caso de contradicción entre documentos, prevalecerán en el siguiente orden:"),
    ("ol", [
        "El **Contrato de Encargo de Tratamiento de Datos Personales**, respecto de todo lo "
        "relativo al tratamiento de datos personales, las medidas de seguridad, las "
        "vulneraciones y los derechos ARCO.",
        "El contrato de prestación de servicios o la orden de compra que las Partes firmen, "
        "respecto de los términos comerciales específicos.",
        "Estos **Términos y Condiciones de Servicio**.",
        "La documentación técnica y las guías publicadas por el Proveedor.",
    ]),
    ("p",
     "Estos Términos, junto con los documentos anteriores, constituyen el **acuerdo "
     "completo** entre las Partes respecto del Servicio y sustituyen cualquier "
     "entendimiento, propuesta o comunicación previa, verbal o escrita. Si alguna cláusula "
     "resultara inválida o inexigible, las demás conservarán su validez y la cláusula "
     "afectada se interpretará de la forma que mejor refleje la intención de las Partes."),

    # =========================== 22 ==================================
    ("h", "Legislación aplicable y jurisdicción"),
    ("p",
     "Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Serán "
     "aplicables, en lo conducente, el Código de Comercio, el Código Civil Federal, la Ley "
     "Federal de Protección al Consumidor cuando el Cliente tenga el carácter de "
     "consumidor, la Ley Federal de Protección de Datos Personales en Posesión de los "
     "Particulares y la Ley Federal del Trabajo, esta última respecto de las obligaciones "
     "que corresponden al Cliente como patrón."),
    ("p",
     "Para la interpretación y cumplimiento de estos Términos, las Partes se someten a la "
     "jurisdicción de los tribunales competentes de **●**, renunciando a cualquier otro "
     "fuero que pudiera corresponderles por razón de sus domicilios presentes o futuros."),
    ("p",
     "Las Partes intentarán resolver de buena fe cualquier controversia mediante "
     "negociación directa dentro de los **treinta (30) días naturales** siguientes a la "
     "notificación escrita de la controversia, antes de acudir a cualquier instancia."),
]

# =====================================================================
# Cierre (después de las cláusulas)
# =====================================================================
CIERRE = [
    ("p",
     f"**Versión:** {VERSION} · **Fecha de entrada en vigor:** {VIGENTE_DESDE}"),
    ("p",
     f"Para dudas sobre estos Términos, escribe a {CORREO_LEGAL}. Para dudas sobre "
     f"protección de datos personales, escribe a {CORREO_PRIVACIDAD}."),
]
