"""
Genera el Contrato de Encargo de Tratamiento de Datos Personales de Chekdor.

Uso:
    python docs/legal/generar_contrato_encargo.py

Salida:
    docs/legal/Contrato_Encargo_Tratamiento_Chekdor.docx
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from docx.shared import Pt  # noqa: E402

from _comun import (  # noqa: E402
    caja_aviso,
    documento_nuevo,
    encabezado_seccion,
    firma,
    numerada,
    parrafo,
    pie_de_pagina,
    tabla,
    vinetas,
)

SALIDA = Path(__file__).parent / "Contrato_Encargo_Tratamiento_Chekdor.docx"

TITULO = "CONTRATO DE ENCARGO DE TRATAMIENTO DE DATOS PERSONALES"
SUBTITULO = "Conforme a los artículos 30 a 34 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares"


def construir() -> None:
    doc = documento_nuevo(TITULO, SUBTITULO)

    # =================================================================
    # Advertencia de uso interno: campos por llenar
    # =================================================================
    caja_aviso(
        doc,
        "CAMPO POR COMPLETAR — elimina este recuadro antes de usar el contrato",
        "Los datos entre corchetes y los marcados con ● deben completarse con la "
        "información real antes de firmar. En particular: la razón social y el RFC de "
        "Chekdor, el domicilio, el representante legal que firma, y los datos del "
        "proveedor de nube (anexo de encargados adicionales). El correo y el teléfono "
        "de contacto de la cláusula de notificaciones también son un ejemplo si no "
        "coinciden con los publicados en el sitio web.",
        "rojo",
    )

    parrafo(
        doc,
        "**CONTRATO DE ENCARGO DE TRATAMIENTO DE DATOS PERSONALES** que celebran, por "
        "una parte, **CHEKDOR** (en lo sucesivo, el __“Encargado”__) y, por la otra, la "
        "persona moral o física identificada en el apartado de Declaraciones como "
        "cliente (en lo sucesivo, el __“Responsable”__), a quienes conjuntamente se les "
        "denominará las __“Partes”__, al tenor de las siguientes declaraciones y "
        "cláusulas:",
    )

    # =================================================================
    # DECLARACIONES
    # =================================================================
    encabezado_seccion(doc, "D E C L A R A C I O N E S")

    parrafo(doc, "**I. Declara el Encargado**, por conducto de su representante legal, que:")
    numerada(
        doc,
        [
            "Es una sociedad constituida conforme a las leyes de los Estados Unidos "
            "Mexicanos, según consta en la escritura pública número ● de fecha ●, otorgada "
            "ante la fe del Notario Público número ● de la ciudad de ●, inscrita en el "
            "Registro Público de Comercio bajo el folio mercantil número ●.",
            "Su Registro Federal de Contribuyentes es ● y su domicilio fiscal se ubica en "
            "●.",
            "Su representante legal cuenta con las facultades suficientes para celebrar el "
            "presente Contrato, mismas que acredita con ● y que no le han sido revocadas ni "
            "modificadas en forma alguna a la fecha de su firma.",
            "Es una empresa que presta servicios de tecnología: un sistema en línea para el "
            "registro de asistencia laboral mediante tecnología de comunicación de campo "
            "cercano (__NFC__), el cálculo de nómina y la generación de archivos de "
            "exportación contable, accesible en el dominio chekdor.com.mx y sus subdominios "
            "(el __“Servicio”__).",
            "Para la prestación del Servicio, trata por cuenta de terceros datos personales "
            "de los que el Responsable es titular, por lo que interviene con el carácter de "
            "__Encargado__ en términos del artículo 3, fracción XIII, de la Ley Federal de "
            "Protección de Datos Personales en Posesión de los Particulares (la __“Ley”__).",
            "Es su voluntad obligarse en los términos del presente Contrato.",
        ],
    )

    parrafo(doc, "**II. Declara el Responsable**, por conducto de su representante legal, que:")
    numerada(
        doc,
        [
            "Es una persona física o moral de nacionalidad mexicana, según se desprende de "
            "●.",
            "Su Registro Federal de Contribuyentes es ● y su domicilio se ubica en ●.",
            "Su representante legal cuenta con facultades suficientes para obligarlo en los "
            "términos del presente Contrato, mismas que no le han sido revocadas ni "
            "modificadas a la fecha.",
            "Es el __Responsable__ del tratamiento de los datos personales de sus "
            "trabajadores, exempleados, candidatos y prestadores de servicios que cargará en "
            "el Servicio, y ha recabado dichos datos con las formalidades que la Ley exige, "
            "incluyendo la entrega del aviso de privacidad correspondiente y, cuando es "
            "necesario, la obtención del consentimiento expreso y por escrito.",
            "Ha leído y acepta el aviso de privacidad del Encargado, publicado en "
            "https://chekdor.com.mx/privacidad-encargado.",
            "Es su voluntad obligarse en los términos del presente Contrato.",
        ],
    )

    parrafo(
        doc,
        "**III. Declaran ambas Partes** que se reconocen mutuamente la personalidad con la "
        "que se ostentan y que es su voluntad celebrar el presente Contrato, con base en lo "
        "anterior y en las siguientes:",
    )

    # =================================================================
    # CLÁUSULAS
    # =================================================================
    encabezado_seccion(doc, "C L Á U S U L A S")

    # ------------------------------ Primera --------------------------
    encabezado_seccion(doc, "PRIMERA. Objeto del tratamiento.")
    parrafo(
        doc,
        "El Encargado tratará los datos personales que el Responsable le proporcione o "
        "cargue en el Servicio, **únicamente con la finalidad** de prestar los servicios "
        "contratados, consistentes en:",
    )
    numerada(
        doc,
        [
            "Registrar y almacenar los marcajes de entrada, salida e interrupciones de "
            "jornada de los trabajadores del Responsable.",
            "Calcular las jornadas de trabajo y el tiempo extraordinario conforme a la Ley "
            "Federal del Trabajo.",
            "Calcular la nómina del periodo que el Responsable determine, incluyendo "
            "percepciones, deducciones, retención de ISR, cuotas obrero-patronales del IMSS, "
            "aportaciones al SAR e INFONAVIT.",
            "Generar los archivos de exportación de nómina y las pólizas contables para su "
            "importación en los sistemas de contabilidad del Responsable.",
            "Emitir los reportes de asistencia, jornadas y nómina que el Responsable "
            "solicite.",
            "Registrar la evidencia del consentimiento del trabajador respecto del aviso de "
            "privacidad del Responsable y dar seguimiento a las solicitudes de derechos "
            "ARCO que el Responsable reciba, cuando el Responsable use los módulos "
            "correspondientes del Servicio.",
            "Aplicar la evaluación de factores de riesgo psicosocial y dar seguimiento a las "
            "medidas de control, cuando el Responsable use el módulo correspondiente.",
        ],
    )
    parrafo(
        doc,
        "**El Encargado no podrá tratar los datos personales para finalidades distintas a "
        "las aquí previstas**, ni destinarlos a publicidad, prospección comercial, "
        "elaboración de perfiles con fines comerciales, venta o cesión a terceros. "
        "Cualquier tratamiento que exceda el objeto del presente Contrato requerirá la "
        "instrucción previa y por escrito del Responsable.",
    )

    # ------------------------------ Segunda --------------------------
    encabezado_seccion(doc, "SEGUNDA. Datos personales y titulares comprendidos.")
    parrafo(
        doc,
        "El tratamiento comprende las categorías de datos personales y de titulares "
        "siguientes. En el **Anexo A** se detalla el inventario de datos por módulo del "
        "Servicio, que forma parte integrante de este Contrato.",
    )
    tabla(
        doc,
        ["Categoría de titulares", "Categorías de datos personales"],
        [
            [
                "Trabajadores y exempleados del Responsable",
                "**Identificación:** nombre completo, fotografía (opcional), código de "
                "empleado, número de tarjeta NFC asignada.\n"
                "**Identificación oficial:** CURP, RFC, NSS.\n"
                "**Laborales:** puesto, departamento, tipo de contrato, fecha de ingreso, "
                "jornada semanal contratada, salario diario.\n"
                "**Patrimoniales y financieros:** importes de nómina, banco, CLABE "
                "interbancaria o número de cuenta.\n"
                "**De jornada:** fecha y hora de cada marcaje, dirección IP y agente de "
                "usuario del dispositivo empleado, ubicación geográfica del punto de "
                "marcaje.\n"
                "**De salud:** resultados de la evaluación de factores de riesgo "
                "psicosocial, cuando el Responsable use el módulo NOM-035. ~~Esta categoría "
                "requiere consentimiento expreso y por escrito del trabajador.~~\n"
                "**De cumplimiento:** constancia de la aceptación del aviso de privacidad y "
                "solicitudes de derechos ARCO.",
            ],
            [
                "Personal administrativo y usuarios del Responsable",
                "Nombre, correo electrónico, rol asignado en el sistema, registro de último "
                "acceso y bitácora de las acciones realizadas en el Servicio.",
            ],
        ],
        [4.5, 10.5],
    )
    caja_aviso(
        doc,
        "Datos de salud y datos patrimoniales: atención especial",
        "Los resultados de la evaluación de riesgo psicosocial son **datos personales "
        "sensibles**. Los datos bancarios y de nómina son **datos personales "
        "patrimoniales o financieros**. El Responsable es quien debe obtener el "
        "consentimiento expreso y por escrito para el tratamiento de los primeros, y quien "
        "asume la obligación de contar con la base legal para tratar los segundos. El "
        "Encargado no recaba estos datos directamente del titular: los recibe del "
        "Responsable, que es quien los captura o los carga.",
        "ambar",
    )
    parrafo(
        doc,
        "El Responsable **no deberá** cargar en el Servicio datos personales sensibles "
        "distintos de los previstos en esta cláusula, en particular datos sobre origen "
        "racial o étnico, estado de salud presente o futuro distinto del señalado, "
        "información genética, creencias religiosas, filosóficas y morales, opiniones "
        "políticas, preferencia sexual o datos de niñas, niños y adolescentes. De hacerlo, "
        "asumirá las consecuencias legales que correspondan y responderá de los daños que "
        "cause al Encargado o a terceros.",
    )

    # ------------------------------ Tercera --------------------------
    encabezado_seccion(doc, "TERCERA. Carácter de las instrucciones y límites del Encargado.")
    parrafo(
        doc,
        "El Encargado tratará los datos personales conforme a las instrucciones del "
        "Responsable, contenidas en el presente Contrato y en las que posteriormente le "
        "comunique por escrito a través de los canales de soporte del Servicio. El "
        "Encargado no está obligado a cumplir instrucciones que contravengan la Ley o que "
        "excedan el objeto del Contrato.",
    )
    parrafo(
        doc,
        "**Si el Encargado considera que una instrucción del Responsable es contraria a la "
        "Ley o puede vulnerar los derechos de los titulares, lo hará saber de inmediato y "
        "por escrito al Responsable**, y podrá suspender su ejecución hasta recibir una "
        "instrucción confirmada por escrito, sin que ello se considere un incumplimiento "
        "del Contrato.",
    )
    parrafo(
        doc,
        "El Encargado queda **prohibido** de tratar los datos personales por cuenta propia "
        "para finalidades distintas a las instruidas; de transferirlos a terceros distintos "
        "de los subencargados autorizados en la Cláusula Sexta; de utilizarlos para "
        "entrenar modelos, análisis agregados con fines comerciales o campañas propias; y "
        "de comercializarlos en cualquier forma.",
    )

    # ------------------------------ Cuarta ---------------------------
    encabezado_seccion(doc, "CUARTA. Obligaciones del Encargado.")
    parrafo(doc, "El Encargado se obliga a:")
    numerada(
        doc,
        [
            "Tratar los datos personales únicamente conforme a las instrucciones del "
            "Responsable y a lo previsto en este Contrato.",
            "No tratar los datos personales para finalidades distintas a las señaladas en "
            "la Cláusula Primera.",
            "Guardar **confidencialidad** respecto de los datos personales tratados, "
            "obligación que subsiste aun después de terminada la relación contractual, sin "
            "limitación de tiempo.",
            "Mantener los datos personales en el entorno controlado del Servicio, sin "
            "reproducirlos, distribuirlos, modificarlos ni divulgarlos salvo por instrucción "
            "escrita del Responsable o por requerimiento de autoridad competente, en cuyo "
            "caso lo notificará al Responsable en un plazo de **tres (3) días hábiles**, "
            "siempre que la ley no le impida hacerlo.",
            "Abstenerse de transferir los datos personales a terceros sin la autorización "
            "previa del Responsable, salvo lo previsto en la Cláusula Sexta.",
            "Atender las solicitudes de derechos ARCO que el Responsable le canalice, en los "
            "términos de la Cláusula Séptima.",
            "**Notificar al Responsable, sin dilación y a más tardar dentro de las "
            "setenta y dos (72) horas** siguientes a que tenga conocimiento, cualquier "
            "vulneración de seguridad que afecte de forma significativa los derechos "
            "patrimoniales o morales de los titulares, conforme al artículo 20 de la Ley y a "
            "la Cláusula Novena de este Contrato.",
            "Adoptar y mantener las medidas de seguridad administrativas, técnicas y físicas "
            "descritas en el **Anexo B**, y no reducirlas sin causa justificada.",
            "Mantener un **registro de las operaciones de tratamiento** realizadas sobre los "
            "datos personales, disponible para el Responsable a solicitud, conforme al "
            "artículo 3, fracción XXXII, de la Ley y su Reglamento.",
            "Designar a la persona o área responsable de la seguridad de los datos "
            "personales y comunicar sus datos de contacto al Responsable.",
            "Capacitar a su personal en materia de protección de datos personales, al menos "
            "una vez al año, y dejar constancia de la capacitación.",
            "Suscribir con todo el personal que intervenga en el tratamiento un acuerdo de "
            "confidencialidad y de uso limitado de la información, en términos del artículo "
            "31 del Reglamento de la Ley.",
            "Realizar la verificación y, en su caso, la supresión de los datos personales "
            "cuando el Responsable lo solicite y al término del Contrato, conforme a la "
            "Cláusula Décima.",
            "Permitir y facilitar las labores de verificación y auditoría del Responsable o "
            "de un tercero designado por él, en los términos de la Cláusula Duodécima.",
        ],
    )

    # ------------------------------ Quinta ---------------------------
    encabezado_seccion(doc, "QUINTA. Obligaciones del Responsable.")
    numerada(
        doc,
        [
            "Proporcionar al Encargado únicamente los datos personales **necesarios, "
            "adecuados y relevantes** para las finalidades del tratamiento (principio de "
            "minimización de datos).",
            "Recabar los datos personales con las formalidades de ley, incluyendo la puesta "
            "a disposición del aviso de privacidad y, cuando corresponda, la obtención del "
            "consentimiento expreso y por escrito del titular.",
            "**Atender las solicitudes de derechos ARCO** que los titulares presenten "
            "directamente, ya que el Encargado no es el responsable del tratamiento y no "
            "puede resolverlas por sí mismo.",
            "Responder ante los titulares y ante la autoridad por cualquier vulneración de "
            "los principios y deberes de la Ley derivada de datos que haya cargado en el "
            "Servicio, o de instrucciones que haya dado al Encargado.",
            "Designar a un interlocutor con facultades para dar instrucciones al Encargado "
            "en materia de datos personales y comunicar sus datos de contacto.",
            "Informar de inmediato al Encargado cualquier hecho del que tenga conocimiento "
            "que pueda afectar la seguridad de los datos personales.",
            "Cubrir la contraprestación pactada en el contrato de servicios, ya que la "
            "prestación del Servicio es la causa que da origen a este encargo.",
            "Revisar y validar los cálculos de nómina, las tarifas fiscales vigentes y los "
            "archivos de exportación antes de surtir efectos ante el Servicio de "
            "Administración Tributaria o ante cualquier autoridad. **El cálculo de "
            "contribuciones y retenciones es responsabilidad del Responsable y de su "
            "contador**, y el Servicio es una herramienta de apoyo que aplica los "
            "parámetros que el propio Responsable configura.",
        ],
    )

    # ------------------------------ Sexta ----------------------------
    encabezado_seccion(doc, "SEXTA. Encargados adicionales (subcontratación).")
    parrafo(
        doc,
        "El Responsable **autoriza** al Encargado para subcontratar el tratamiento con los "
        "prestadores de servicios de infraestructura tecnológica y de cómputo en la nube "
        "enumerados en el **Anexo C**, en el entendido de que:",
    )
    numerada(
        doc,
        [
            "El Encargado dará aviso al Responsable de cualquier cambio o incorporación de "
            "un nuevo subencargado, con **quince (15) días naturales** de anticipación "
            "cuando el cambio implique una modificación al Anexo C. El aviso se dará por "
            "correo electrónico a la dirección que el Responsable tenga registrada en el "
            "Servicio.",
            "Si el Responsable se opone motivadamente al cambio dentro de ese plazo, las "
            "Partes negociarán de buena fe una alternativa; de no alcanzarse, el "
            "Responsable podrá dar por terminado el Contrato sin penalidad, conforme a la "
            "Cláusula Décima.",
            "El Encargado **impone a sus subencargados, mediante contrato, las mismas "
            "obligaciones** de protección de datos que asume en este Contrato, en términos "
            "del artículo 32 del Reglamento de la Ley.",
            "El Encargado **responde ante el Responsable** por el tratamiento que realicen "
            "sus subencargados, y responderá por los daños que ellos causen cuando hayan "
            "actuado sin instrucciones del Encargado o en contra de ellas.",
        ],
    )
    parrafo(
        doc,
        "**No se consideran subencargados** los asesores profesionales del Responsable, ni "
        "los sistemas contables del Responsable (CONTPAQi, Aspel o cualquier otro) en los "
        "que este importe los archivos que descargue del Servicio. La descarga y el uso de "
        "dichos archivos ocurren bajo la responsabilidad exclusiva del Responsable y en un "
        "entorno que él controla.",
    )

    # ----------------------------- Séptima ---------------------------
    encabezado_seccion(doc, "SÉPTIMA. Derechos de los titulares (ARCO).")
    parrafo(
        doc,
        "El Encargado no es el responsable del tratamiento y **no puede atender "
        "directamente** las solicitudes de acceso, rectificación, cancelación u oposición "
        "que los titulares le presenten, ya que no le corresponde acreditar la identidad "
        "del titular ni determinar la procedencia de la solicitud.",
    )
    numerada(
        doc,
        [
            "Si el Encargado recibe una solicitud de derechos ARCO o una solicitud de "
            "revocación del consentimiento, **la remitirá al Responsable dentro de los tres "
            "(3) días hábiles siguientes** a su recepción, por correo electrónico, sin "
            "resolverla ni dar respuesta al titular.",
            "Cuando el titular presente la solicitud por un canal del Servicio, el Encargado "
            "le informará que su solicitud corresponde al Responsable y la canalizará de "
            "inmediato.",
            "A solicitud del Responsable, el Encargado **le asistirá técnicamente** para "
            "localizar, extraer, rectificar, bloquear o suprimir los datos del titular "
            "dentro del Servicio, en un plazo máximo de **diez (10) días hábiles** contados "
            "a partir de la instrucción escrita, sin costo adicional.",
            "El Encargado documentará cada solicitud y su canalización, para que el "
            "Responsable pueda acreditar el plazo de respuesta de veinte (20) días hábiles "
            "que establece el artículo 32 de la Ley.",
        ],
    )

    # ----------------------------- Octava ----------------------------
    encabezado_seccion(doc, "OCTAVA. Medidas de seguridad.")
    parrafo(
        doc,
        "El Encargado implementa las medidas de seguridad administrativas, técnicas y "
        "físicas detalladas en el **Anexo B**, y se obliga a:",
    )
    numerada(
        doc,
        [
            "Mantener dichas medidas vigentes durante toda la relación contractual.",
            "Mejorarlas cuando exista riesgo de vulneración o cuando la evolución "
            "tecnológica lo haga necesario, sin que ello implique una reducción del nivel "
            "de protección.",
            "Documentar las medidas, sus actualizaciones y las razones que las motivaron.",
            "No reducirlas sin causa justificada ni en perjuicio de los titulares.",
        ],
    )
    caja_aviso(
        doc,
        "DECLARACIÓN DE MEDIDAS PENDIENTES — elimina este recuadro cuando se cierren",
        "El **Anexo B** marca expresamente las medidas que están **implementadas** y las "
        "que están **pendientes**. Al firmar un contrato, el Encargado se obliga a lo que "
        "ahí se declara, por lo que las medidas pendientes deben **describirse como "
        "pendientes con fecha comprometida de cierre**, nunca presentarse como vigentes. "
        "Afirmar por escrito que existe un control que no está implementado es, por sí "
        "mismo, un incumplimiento contractual.",
        "rojo",
    )

    # ----------------------------- Novena ----------------------------
    encabezado_seccion(doc, "NOVENA. Vulneraciones de seguridad.")
    parrafo(
        doc,
        "Para efectos del artículo 20 de la Ley, se entenderá por **vulneración de "
        "seguridad** toda pérdida, destrucción, acceso, uso o divulgación no autorizados de "
        "los datos personales tratados por el Encargado.",
    )
    numerada(
        doc,
        [
            "El Encargado **notificará al Responsable sin dilación y a más tardar dentro de "
            "las setenta y dos (72) horas** siguientes a que tenga conocimiento de la "
            "vulneración.",
            "La notificación incluirá, como mínimo: (i) la fecha y hora en que ocurrió o se "
            "detectó; (ii) la naturaleza de la vulneración; (iii) las categorías y el número "
            "aproximado de titulares afectados; (iv) las categorías de datos comprometidos, "
            "señalando si son sensibles; (v) las medidas adoptadas para contener la "
            "vulneración y evitar que se repita; y (vi) el nombre y datos de contacto del "
            "interlocutor del Encargado para dar seguimiento.",
            "El Encargado y el Responsable **pondrán a disposición del titular afectado** la "
            "información necesaria sobre la vulneración, así como las recomendaciones sobre "
            "las medidas que este pueda adoptar para proteger sus intereses.",
            "El Encargado **documentará la vulneración, sus causas y las acciones "
            "correctivas**, y conservará esa documentación durante al menos cinco (5) años, "
            "a disposición del Responsable y de la autoridad.",
            "El Encargado colaborará con el Responsable en cualquier investigación, "
            "notificación a la autoridad o comunicación que la normativa exija.",
        ],
    )
    parrafo(
        doc,
        "~~Si la vulneración se debe a culpa o negligencia del Encargado, este responderá "
        "por los daños y perjuicios que cause al Responsable o a los titulares, en los "
        "términos de la Cláusula Decimotercera.~~",
    )

    # ----------------------------- Décima ----------------------------
    encabezado_seccion(doc, "DÉCIMA. Duración y devolución de los datos.")
    parrafo(
        doc,
        "Este Contrato entrará en vigor el día de su firma y tendrá **la misma duración que "
        "el contrato de servicios** que vincula a las Partes, el cual se entiende "
        "prorrogado por periodos iguales mientras alguna de las Partes no manifieste lo "
        "contrario por escrito con al menos treinta (30) días naturales de anticipación.",
    )
    parrafo(doc, "Al término del Contrato, por cualquier causa, el Encargado:")
    numerada(
        doc,
        [
            "**Devolverá al Responsable, a elección de este**, los datos personales en un "
            "formato estructurado y de uso común (CSV o Excel), o pondrá a su disposición "
            "las herramientas del Servicio para que los descargue por sí mismo, durante un "
            "periodo de **treinta (30) días naturales** contados a partir de la terminación.",
            "**Suprimirá** los datos personales de sus sistemas dentro de los **quince (15) "
            "días naturales** siguientes al vencimiento del plazo anterior, salvo aquellos "
            "que deba conservar por mandato legal o para la defensa de un derecho en un "
            "procedimiento administrativo o judicial.",
            "**Entregará al Responsable una constancia escrita** de la supresión realizada, "
            "indicando los sistemas en que obraban y los datos que, en su caso, se "
            "conservarán, con la fundamentación legal y el plazo de conservación.",
            "Se abstendrá de conservar copia de los datos personales para cualquier otro "
            "fin, incluyendo respaldos que se conserven más allá de sus ciclos ordinarios de "
            "respaldo, los cuales se sobrescribirán conforme a la política de retención "
            "descrita en el Anexo B.",
        ],
    )
    parrafo(
        doc,
        "La obligación de **confidencialidad** de la Cláusula Cuarta, fracción III, "
        "subsistirá aun después de la terminación del Contrato y de la supresión de los "
        "datos.",
    )

    # --------------------------- Undécima ----------------------------
    encabezado_seccion(doc, "DÉCIMO PRIMERA. Transferencias internacionales.")
    parrafo(
        doc,
        "El Responsable **autoriza** que los datos personales sean transferidos y "
        "almacenados en servidores ubicados fuera de los Estados Unidos Mexicanos, "
        "conforme a lo siguiente:",
    )
    numerada(
        doc,
        [
            "Las transferencias se realizan a los subencargados y en las ubicaciones "
            "señaladas en el **Anexo C** (regiones de los centros de datos).",
            "Los terceros receptores se obligan, mediante contrato, a cumplir con los "
            "principios y deberes de protección de datos personales previstos en la Ley y su "
            "Reglamento.",
            "El Encargado no es responsable de la transferencia que el propio Responsable "
            "realice al descargar los archivos de exportación y cargarlos en sistemas de "
            "terceros, incluyendo los sistemas contables.",
            "Las transferencias que realice el Encargado se formalizan en los términos del "
            "artículo 34 y del artículo 66 del Reglamento de la Ley.",
        ],
    )

    # --------------------------- Duodécima ---------------------------
    encabezado_seccion(doc, "DÉCIMO SEGUNDA. Auditoría y verificación.")
    parrafo(
        doc,
        "El Responsable podrá verificar el cumplimiento de este Contrato, sujetándose a lo "
        "siguiente:",
    )
    numerada(
        doc,
        [
            "La verificación se realizará **como máximo una vez por año calendario**, salvo "
            "que exista una causa justificada —una vulneración de seguridad, un "
            "requerimiento de autoridad o un incumplimiento acreditado—, en cuyo caso podrá "
            "realizarse de forma extraordinaria.",
            "El Responsable notificará su intención con al menos **quince (15) días "
            "naturales** de anticipación, señalando el alcance, los sistemas involucrados y "
            "el personal que participará.",
            "La verificación se realizará **en horario laboral y sin interrumpir la "
            "operación del Servicio**, y dará inicio con la información que el Encargado "
            "pueda entregar de forma remota o documental.",
            "El personal del Responsable o el tercero que designe suscribirá un acuerdo de "
            "confidencialidad antes de acceder a cualquier información.",
            "**Quedan excluidas** del alcance de la auditoría la documentación interna del "
            "Encargado que contenga información de **otros** clientes, el código fuente, la "
            "configuración de seguridad específica cuya revelación pueda comprometer la "
            "seguridad de los datos, y la información protegida por derechos de propiedad "
            "intelectual de terceros.",
            "Los costos de la verificación correrán por cuenta del Responsable, salvo que "
            "la verificación arroje un incumplimiento imputable al Encargado, en cuyo caso "
            "los asumirá el Encargado.",
            "El Encargado atenderá las solicitudes razonables de información documental "
            "dentro de los **diez (10) días hábiles** siguientes a su recepción.",
        ],
    )

    # -------------------------- Decimotercera ------------------------
    encabezado_seccion(doc, "DÉCIMO TERCERA. Responsabilidad.")
    numerada(
        doc,
        [
            "El Encargado responderá por los daños y perjuicios que cause al Responsable o a "
            "los titulares por el incumplimiento de las obligaciones que asume en este "
            "Contrato, incluyendo el tratamiento de los datos personales sin las "
            "instrucciones del Responsable o en contra de ellas.",
            "El Responsable responderá por los daños y perjuicios que cause al Encargado por "
            "el incumplimiento de sus propias obligaciones, por la falta de veracidad de los "
            "datos que le proporcione, y por haberlos recabado sin cumplir con lo que la Ley "
            "exige.",
            "El Responsable **saca en paz y a salvo** al Encargado de cualquier "
            "reclamación, sanción o procedimiento derivado del tratamiento que el propio "
            "Responsable realice como responsable de los datos personales, en particular "
            "cuando no haya puesto a disposición de los titulares su aviso de privacidad o "
            "no haya recabado el consentimiento que corresponda.",
            "**Límite.** La responsabilidad total acumulada del Encargado derivada de este "
            "Contrato no excederá del importe de las contraprestaciones efectivamente "
            "pagadas por el Responsable durante los **doce (12) meses** anteriores al hecho "
            "que la origine. Esta limitación no aplica cuando el daño derive de **dolo o "
            "mala fe** del Encargado, ni respecto de la obligación de confidencialidad.",
            "El Encargado no será responsable por el tratamiento que terceros realicen sobre "
            "los datos una vez que el Responsable los descargue del Servicio y los incorpore "
            "a sistemas ajenos al mismo, ni por el uso que el Responsable o sus asesores den "
            "a los archivos exportados.",
        ],
    )

    # ------------------------- Decimocuarta --------------------------
    encabezado_seccion(doc, "DÉCIMO CUARTA. Notificaciones.")
    parrafo(
        doc,
        "Para todo lo relacionado con el presente Contrato, las Partes señalan como "
        "domicilios y medios de comunicación los siguientes:",
    )
    tabla(
        doc,
        ["", "Encargado (Chekdor)", "Responsable"],
        [
            ["Domicilio", "●", "●"],
            ["Correo para protección de datos", "privacidad@chekdor.com.mx", "●"],
            ["Correo para notificaciones", "legal@chekdor.com.mx", "●"],
            ["Teléfono", "●", "●"],
            ["Persona responsable", "●", "●"],
        ],
        [4.2, 5.4, 5.4],
    )
    parrafo(
        doc,
        "Cualquier cambio en estos datos deberá comunicarse por escrito a la otra Parte "
        "dentro de los cinco (5) días hábiles siguientes; en su defecto, las notificaciones "
        "hechas a los datos aquí señalados surtirán plenos efectos.",
    )

    # -------------------------- Decimoquinta -------------------------
    encabezado_seccion(doc, "DÉCIMO QUINTA. Protección de datos por defecto y evaluación de impacto.")
    numerada(
        doc,
        [
            "El Encargado aplicará medidas de **protección de datos desde el diseño y por "
            "defecto**, de modo que el tratamiento se limite a los datos necesarios para "
            "cada una de las finalidades previstas en la Cláusula Primera.",
            "El Servicio no solicita datos personales distintos de los que se listan en el "
            "Anexo A, y los módulos que el Responsable no contrate no recaban información.",
            "Cuando el Responsable pretenda realizar un tratamiento que pueda afectar "
            "significativamente sus derechos patrimoniales o morales, podrá solicitar al "
            "Encargado su apoyo para realizar una **evaluación de impacto** en la protección "
            "de datos personales. El Encargado no está obligado a realizar la evaluación por "
            "cuenta del Responsable, pero sí a proporcionarle la información técnica "
            "razonable sobre el funcionamiento del Servicio que esta requiera.",
            "El Encargado implementará controles de **acceso con privilegios mínimos**, "
            "separación lógica de la información de cada Responsable y registro de las "
            "operaciones, conforme al Anexo B.",
        ],
    )

    # -------------------------- Decimosexta --------------------------
    encabezado_seccion(doc, "DÉCIMO SEXTA. Modificaciones.")
    parrafo(
        doc,
        "Cualquier modificación al presente Contrato deberá constar por escrito y ser "
        "firmada por los representantes de ambas Partes. El Encargado podrá actualizar "
        "**unilateralmente** el Anexo B (medidas de seguridad) y el Anexo C (subencargados) "
        "cuando ello implique una mejora en el nivel de protección, notificándolo al "
        "Responsable por correo electrónico con al menos quince (15) días naturales de "
        "anticipación. Cualquier cambio en el Anexo C que implique un subencargado nuevo se "
        "sujeta a lo previsto en la Cláusula Sexta.",
    )

    # ------------------------ Decimoséptima --------------------------
    encabezado_seccion(doc, "DÉCIMO SÉPTIMA. Legislación aplicable y jurisdicción.")
    parrafo(
        doc,
        "El presente Contrato se rige por la Ley Federal de Protección de Datos Personales "
        "en Posesión de los Particulares, su Reglamento, los Lineamientos del Aviso de "
        "Privacidad, y supletoriamente por el Código Civil Federal y el Código de Comercio. "
        "Para la interpretación y cumplimiento del Contrato, las Partes se someten a la "
        "jurisdicción de los tribunales competentes de ●, renunciando a cualquier otro "
        "fuero que pudiere corresponderles por razón de sus domicilios presentes o futuros.",
    )

    # =================================================================
    # ANEXOS
    # =================================================================
    doc.add_page_break()
    encabezado_seccion(doc, "ANEXO A. Inventario de datos personales por módulo")

    parrafo(
        doc,
        "Este inventario forma parte integrante del Contrato y se corresponde con la "
        "estructura real de la base de datos del Servicio.",
    )
    tabla(
        doc,
        ["Módulo del Servicio", "Datos personales que trata", "Titulares"],
        [
            [
                "Empleados",
                "Nombre completo, código de empleado, CURP, RFC, NSS, puesto, "
                "departamento, salario diario, tipo de contrato, fecha de ingreso, jornada "
                "semanal, identificador de la tarjeta NFC, fotografía (opcional).",
                "Trabajadores y exempleados",
            ],
            [
                "Usuarios y perfiles",
                "Nombre, correo electrónico, rol dentro del sistema, último acceso, IP y "
                "agente de usuario del navegador.",
                "Personal administrativo del Responsable",
            ],
            [
                "Marcaje NFC",
                "Fecha y hora de cada marcaje, tipo (entrada, salida, comida), método, "
                "identificador del punto de marcaje, IP de origen, agente de usuario y "
                "coordenadas del punto (no del empleado).",
                "Trabajadores y exempleados",
            ],
            [
                "Jornadas",
                "Horas ordinarias, extraordinarias al doble y al triple, prima dominical, "
                "incidencias detectadas.",
                "Trabajadores y exempleados",
            ],
            [
                "Nómina",
                "Salario base de cotización, días pagados, percepciones y deducciones "
                "desglosadas, ISR retenido, cuotas obrero-patronales del IMSS, aportaciones "
                "al SAR e INFONAVIT, neto a pagar.",
                "Trabajadores y exempleados",
            ],
            [
                "Cuentas bancarias",
                "Banco, CLABE interbancaria (18 dígitos) y número de cuenta, para la "
                "dispersión del pago.",
                "Trabajadores",
            ],
            [
                "Descuentos del empleado",
                "Pensión alimenticia, préstamos y créditos, descuento por crédito "
                "INFONAVIT. ~~Pueden revelar situaciones familiares o patrimoniales.~~",
                "Trabajadores",
            ],
            [
                "Privacidad",
                "Constancia de la aceptación del aviso de privacidad del Responsable "
                "(fecha, método, IP y agente de usuario) y solicitudes de derechos ARCO "
                "presentadas.",
                "Trabajadores y exempleados",
            ],
            [
                "NOM-035",
                "Política de prevención, respuestas al cuestionario de factores de riesgo "
                "psicosocial y nivel de riesgo obtenido. ~~Datos personales sensibles: "
                "requieren consentimiento expreso y por escrito.~~",
                "Trabajadores",
            ],
            [
                "Puntos de marcaje",
                "Nombre y ubicación del punto, coordenadas geográficas y token del "
                "dispositivo. No contiene datos de personas.",
                "No aplica",
            ],
        ],
        [3.2, 8.6, 3.2],
    )
    caja_aviso(
        doc,
        "Revisa este inventario cada vez que agregues un módulo",
        "El inventario debe reflejar lo que el Servicio realmente trata. Si se agrega un "
        "campo o un módulo nuevo (por ejemplo, la integración de dictámenes de "
        "incapacidad, expedientes médicos o evaluaciones de desempeño), este anexo debe "
        "actualizarse y, cuando se trate de datos sensibles, requiere la firma de un nuevo "
        "consentimiento expreso por parte de los titulares.",
        "ambar",
    )

    doc.add_page_break()
    encabezado_seccion(doc, "ANEXO B. Medidas de seguridad")
    parrafo(
        doc,
        "Las medidas se clasifican según su estado real. **Las medidas “Pendientes” no "
        "deben declararse como vigentes**: se enlistan con su fecha comprometida de cierre "
        "y su responsable, para que el Responsable conozca el nivel de madurez del Servicio "
        "antes de confiarle datos personales.",
    )

    parrafo(doc, "**B.1 Medidas administrativas**", justificar=False)
    tabla(
        doc,
        ["Medida", "Estado", "Detalle"],
        [
            [
                "Política de privacidad y aviso de privacidad del Encargado",
                "Implementada",
                "Aviso publicado en el sitio y aviso dirigido a los titulares cuyos datos "
                "trata por cuenta del Responsable.",
            ],
            [
                "Registro de operaciones de tratamiento",
                "Implementada",
                "Bitácora de auditoría en la base de datos. Registra la acción, el usuario, "
                "el registro afectado, el detalle y la fecha.",
            ],
            [
                "Acuerdo de confidencialidad con el personal",
                "Implementada",
                "Cláusula de confidencialidad en el contrato individual de trabajo de todo "
                "el personal con acceso a datos personales.",
            ],
            [
                "Capacitación anual en protección de datos",
                "Pendiente",
                "Fecha comprometida: ●. Responsable: ●.",
            ],
            [
                "Procedimiento documentado de atención a vulneraciones",
                "Pendiente",
                "Existe la obligación contractual de notificar en 72 horas; falta el "
                "procedimiento interno escrito, con responsables y formato de registro. "
                "Fecha comprometida: ●.",
            ],
            [
                "Política documentada de retención y destrucción",
                "Pendiente",
                "Actualmente la eliminación se ejecuta a petición del Responsable. Falta "
                "documentar los plazos por tipo de dato. Fecha comprometida: ●.",
            ],
            [
                "Registro de accesos privilegiados a la base de datos",
                "Pendiente",
                "Los accesos administrativos a la base de datos no quedan registrados en la "
                "bitácora de la aplicación. Fecha comprometida: ●.",
            ],
        ],
        [5.0, 2.4, 7.6],
    )

    parrafo(doc, "**B.2 Medidas técnicas**", justificar=False)
    tabla(
        doc,
        ["Medida", "Estado", "Detalle"],
        [
            [
                "Cifrado en tránsito",
                "Implementada",
                "HTTPS/TLS en todas las comunicaciones entre el navegador, el Servicio y la "
                "base de datos. La plataforma de despliegue fuerza HTTPS.",
            ],
            [
                "Autenticación de usuarios",
                "Implementada",
                "Correo y contraseña con un mínimo de 8 caracteres. Las contraseñas se "
                "almacenan con hash mediante el servicio de autenticación de la plataforma; "
                "el Encargado no accede a las contraseñas en claro.",
            ],
            [
                "Separación lógica por Responsable (aislamiento multi-empresa)",
                "Implementada",
                "Seguridad a nivel de fila (Row Level Security) de PostgreSQL. Cada consulta "
                "se restringe al identificador de empresa contenido en el token de sesión "
                "del usuario, que la base de datos valida. Un Responsable no puede consultar "
                "información de otro.",
            ],
            [
                "Control de acceso por roles",
                "Implementada",
                "Roles diferenciados: administrador de empresa, recursos humanos, supervisor "
                "y empleado. El personal operativo solo puede consultar su propia "
                "información de jornada y nómina.",
            ],
            [
                "Restricción de acceso a la nómina",
                "Implementada",
                "Los módulos de nómina y contabilidad solo son accesibles para los roles "
                "administrativos. La exportación de datos de nómina valida el rol en el "
                "servidor, no solo en la interfaz.",
            ],
            [
                "Credenciales de dispositivo con alta entropía",
                "Implementada",
                "Los puntos de marcaje usan tokens de 128 bits generados "
                "criptográficamente, regenerables desde el panel.",
            ],
            [
                "Control anti-fraude en el marcaje",
                "Implementada",
                "El registro de marcaje valida una ventana temporal de ±5 minutos y rechaza "
                "marcajes duplicados del mismo tipo dentro de 60 segundos.",
            ],
            [
                "Validación de formato de datos de identificación",
                "Implementada",
                "La CURP, el RFC y el NSS se validan contra su patrón oficial antes de "
                "guardarse.",
            ],
            [
                "Cifrado de datos personales en reposo a nivel de aplicación",
                "Pendiente",
                "~~La CURP, el RFC, el NSS y la CLABE se almacenan sin cifrado adicional, "
                "protegidos por el cifrado de disco y el control de acceso de la plataforma "
                "de base de datos.~~ Fecha comprometida: ●.",
            ],
            [
                "Autenticación de dos factores para cuentas administrativas",
                "Pendiente",
                "Soportado por la plataforma de autenticación; falta activarlo y exigirlo "
                "para los roles administrativos. Fecha comprometida: ●.",
            ],
            [
                "Limitación de intentos de inicio de sesión",
                "Implementada",
                "La plataforma de autenticación aplica limitación de tasa y bloqueo "
                "temporal tras intentos fallidos.",
            ],
            [
                "Registro y monitoreo de errores de aplicación",
                "Implementada",
                "Los errores no controlados se registran con su identificador de traza, sin "
                "incluir datos personales en el mensaje.",
            ],
            [
                "Respaldo automático de la base de datos",
                "Implementada",
                "Respaldos diarios administrados por la plataforma de base de datos.",
            ],
            [
                "Prueba documentada de restauración de respaldos",
                "Pendiente",
                "No se ha ejecutado ni documentado una prueba de restauración completa. "
                "Fecha comprometida: ●.",
            ],
            [
                "Prueba de penetración por tercero independiente",
                "Pendiente",
                "Fecha comprometida: ●.",
            ],
            [
                "Eliminación segura y verificable de los datos al término",
                "Implementada",
                "La supresión en cascada está garantizada por las restricciones de "
                "integridad referencial de la base de datos: al eliminar una empresa se "
                "eliminan sus empleados, marcajes, jornadas y recibos de nómina.",
            ],
        ],
        [5.0, 2.4, 7.6],
    )

    parrafo(doc, "**B.3 Medidas físicas**", justificar=False)
    tabla(
        doc,
        ["Medida", "Estado", "Detalle"],
        [
            [
                "Control de acceso físico al centro de datos",
                "Implementada",
                "El Servicio se aloja en infraestructura de cómputo en la nube administrada "
                "por el subencargado indicado en el Anexo C, que certifica los controles "
                "físicos de sus instalaciones. El Encargado no opera centros de datos "
                "propios.",
            ],
            [
                "Equipos de trabajo con cifrado de disco",
                "Implementada",
                "Los equipos del personal del Encargado cuentan con cifrado de disco "
                "habilitado y bloqueo de pantalla por inactividad.",
            ],
            [
                "Acceso a la información de producción desde equipos personales",
                "Pendiente",
                "Falta una política que prohíba el acceso a datos de producción desde "
                "dispositivos no administrados. Fecha comprometida: ●.",
            ],
        ],
        [5.0, 2.4, 7.6],
    )

    doc.add_page_break()
    encabezado_seccion(doc, "ANEXO C. Encargados adicionales y transferencias internacionales")
    caja_aviso(
        doc,
        "CAMPO POR COMPLETAR — verifica estos datos con tu proveedor",
        "Los nombres y las regiones deben corresponder a lo que **realmente** tienes "
        "contratado. Verifica en el panel de cada proveedor la región del proyecto: si "
        "contrataste la región de Estados Unidos y declaras Brasil, la declaración es "
        "falsa. Un solo proveedor mal declarado invalida el anexo completo.",
        "rojo",
    )
    parrafo(
        doc,
        "El Encargado utiliza los siguientes encargados adicionales para la prestación del "
        "Servicio. Todos ellos están sujetos contractualmente a obligaciones de "
        "confidencialidad y de protección de datos personales equivalentes a las del "
        "presente Contrato.",
    )
    tabla(
        doc,
        ["Encargado adicional", "Servicio que presta", "Datos a los que accede", "Ubicación de los servidores"],
        [
            [
                "Supabase, Inc.",
                "Base de datos PostgreSQL administrada y servicio de autenticación.",
                "Todos los datos personales descritos en el Anexo A.",
                "Región: ● (verificar en el panel del proyecto).",
            ],
            [
                "Vercel Inc.",
                "Alojamiento de la aplicación, red de distribución de contenido y "
                "ejecución del servidor de aplicaciones.",
                "Los datos en tránsito durante el uso del Servicio. No almacena la base de "
                "datos.",
                "Región: ● (verificar en el panel del proyecto).",
            ],
            [
                "● (proveedor de correo transaccional)",
                "Envío de correos de confirmación de cuenta y de notificaciones del "
                "Servicio.",
                "Nombre y correo electrónico de los usuarios administrativos.",
                "●",
            ],
            [
                "● (servicio de monitoreo de errores)",
                "Registro y diagnóstico de errores de la aplicación.",
                "Registro técnico del error. ~~No debe incluir datos personales: verifica "
                "la configuración de filtrado antes de activarlo.~~",
                "●",
            ],
        ],
        [3.6, 4.2, 4.2, 3.0],
    )
    parrafo(
        doc,
        "El Responsable autoriza expresamente la **transferencia internacional** de los "
        "datos personales a las ubicaciones señaladas, en el entendido de que los "
        "receptores asumen las mismas obligaciones que el Encargado y de que esta "
        "autorización se otorga en términos del artículo 34 de la Ley.",
    )

    parrafo(doc, "**Inventario de proveedores contratados**", justificar=False)
    parrafo(
        doc,
        "El siguiente cuadro es un instrumento de control interno del Encargado. Debe "
        "reflejar la lista real de proveedores con acceso a datos personales y su nivel de "
        "riesgo, y revisarse al menos cada seis meses.",
    )
    tabla(
        doc,
        ["Proveedor", "Contrato de encargo firmado", "Evaluado", "Riesgo", "Última revisión"],
        [
            ["●", "Sí / No", "Sí / No", "Alto / Medio / Bajo", "●"],
        ],
        [3.6, 4.2, 2.6, 2.6, 2.6],
    )

    # =================================================================
    # Firmas
    # =================================================================
    doc.add_page_break()
    encabezado_seccion(doc, "FIRMAS")
    parrafo(
        doc,
        "Las Partes manifiestan su conformidad y firman el presente Contrato de Encargo de "
        "Tratamiento de Datos Personales, por duplicado, en la ciudad de ●, el día ● de ● "
        "de ●●.",
    )
    firma(doc, ["EL ENCARGADO", "EL RESPONSABLE"])

    parrafo(
        doc,
        "**Testigos**",
        justificar=False,
    )
    firma(doc, ["Testigo 1", "Testigo 2"])

    pie_de_pagina(
        doc,
        "Contrato de Encargo de Tratamiento de Datos Personales · Chekdor",
    )

    doc.save(SALIDA)
    print(f"OK -> {SALIDA}")


if __name__ == "__main__":
    construir()
