"""
Genera los Términos y Condiciones en DOCX desde la fuente única.

Uso:
    python docs/legal/terminos/generar_docx.py

Salida:
    docs/legal/Terminos_y_Condiciones_Chekdor.docx

El texto NO vive aquí: vive en contenido_terminos.py. Este archivo solo lo
formatea. Si necesitas cambiar una cláusula, edita la fuente, no este script.
"""

import sys
from pathlib import Path

AQUI = Path(__file__).parent
sys.path.insert(0, str(AQUI))
sys.path.insert(0, str(AQUI.parent))

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
from contenido_terminos import (  # noqa: E402
    BLOQUES,
    CIERRE,
    SUBTITULO,
    TITULO,
    VERSION,
    VIGENTE_DESDE,
)

SALIDA = AQUI.parent / "Terminos_y_Condiciones_Chekdor.docx"


def construir() -> None:
    doc = documento_nuevo(TITULO, SUBTITULO)

    seccion = 0

    for tipo, dato in BLOQUES:
        if tipo == "h":
            seccion += 1
            encabezado_seccion(doc, f"{seccion}. {dato}")

        elif tipo == "p":
            parrafo(doc, dato)

        elif tipo == "ul":
            vinetas(doc, list(dato))

        elif tipo == "ol":
            numerada(doc, list(dato))

        elif tipo == "tabla":
            encabezados, filas = dato
            # Reparto de ancho proporcional al texto de la primera columna.
            ancho = 15.0
            n = len(encabezados)
            anchos = [ancho / n] * n
            tabla(doc, list(encabezados), [list(f) for f in filas], anchos)

        elif tipo == "aviso":
            titulo, texto, tono = dato
            caja_aviso(doc, titulo, texto, tono or "ambar")

        else:  # pragma: no cover
            raise ValueError(f"Tipo de bloque desconocido: {tipo}")

    # ------------------------------- Cierre -------------------------------
    doc.add_paragraph()
    for tipo, dato in CIERRE:
        parrafo(doc, dato, justificar=False)

    # ------------------------------- Firmas -------------------------------
    if not any(t == "aviso" for t, _ in BLOQUES):
        # El bloque de firmas solo se incluye en la versión definitiva. Mientras
        # el documento siga en revisión (con recuadros de campos por completar),
        # no tiene sentido.
        doc.add_page_break()
        encabezado_seccion(doc, "ACEPTACIÓN")
        parrafo(
            doc,
            "El Cliente manifiesta haber leído y aceptado los presentes Términos y "
            "Condiciones de Servicio. La aceptación puede otorgarse de forma electrónica al "
            "momento del registro, conforme a la sección 2, o mediante la firma de este "
            "documento.",
        )
        firma(doc, ["EL PROVEEDOR", "EL CLIENTE"])

    parrafo(
        doc,
        f"**Versión {VERSION}** · Documento generado desde "
        "__docs/legal/terminos/contenido_terminos.py__.",
        justificar=False,
    )

    pie_de_pagina(doc, f"Términos y Condiciones de Servicio · Chekdor · v{VERSION}")

    doc.save(SALIDA)
    print(f"OK -> {SALIDA}")


if __name__ == "__main__":
    construir()
