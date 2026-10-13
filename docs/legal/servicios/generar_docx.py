"""
Genera el Contrato de Prestación de Servicios en DOCX.

Uso:
    python docs/legal/servicios/generar_docx.py

Salida:
    docs/legal/Contrato_Prestacion_Servicios_Chekdor.docx

El texto NO vive aquí: vive en contenido_contrato.py. Este archivo solo lo
formatea. Si necesitas cambiar una cláusula, edita la fuente.
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
from contenido_contrato import (  # noqa: E402
    ANEXOS,
    BLOQUES,
    CIERRE,
    SUBTITULO,
    TITULO,
    VERSION,
)

SALIDA = AQUI.parent / "Contrato_Prestacion_Servicios_Chekdor.docx"

ROMANOS = [
    "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
    "XXI", "XXII", "XXIII", "XXIV", "XXV",
]


def romano(n: int) -> str:
    """Numeración romana para las cláusulas, que es la convención en contratos."""
    if 1 <= n <= len(ROMANOS):
        return ROMANOS[n - 1]
    return str(n)


def escribir_bloques(doc, bloques, numerar_clausulas: bool) -> None:
    """Vuelca una lista de bloques al documento.

    `numerar_clausulas` distingue el cuerpo del contrato (cláusulas con
    numeración romana) de los anexos (que traen su propio título ya escrito
    en la fuente).
    """
    n = 0
    for tipo, dato in bloques:
        if tipo == "h":
            if numerar_clausulas:
                n += 1
                encabezado_seccion(doc, f"CLÁUSULA {romano(n)}. {dato}")
            else:
                encabezado_seccion(doc, str(dato))

        elif tipo == "h2":
            # Subtítulo dentro de una sección: no cuenta como cláusula ni
            # compite visualmente con los títulos de anexo.
            encabezado_seccion(doc, str(dato), nivel=2)

        elif tipo == "p":
            parrafo(doc, dato)

        elif tipo == "ul":
            vinetas(doc, list(dato))

        elif tipo == "ol":
            numerada(doc, list(dato))

        elif tipo == "tabla":
            encabezados, filas = dato
            columnas = len(encabezados)
            # Reparto parejo del ancho de la caja de texto. Las tablas de
            # este contrato tienen entre 2 y 4 columnas, así que un reparto
            # uniforme es suficiente y evita cálculos frágiles.
            ancho = 15.2
            anchos = [ancho / columnas] * columnas
            tabla(doc, list(encabezados), [list(f) for f in filas], anchos)

        elif tipo == "aviso":
            titulo, texto, tono = dato
            caja_aviso(doc, titulo, texto, tono or "ambar")

        else:  # pragma: no cover
            raise ValueError(f"Tipo de bloque desconocido: {tipo}")


def construir() -> None:
    doc = documento_nuevo(TITULO, SUBTITULO)

    # ------------------------- Cuerpo del contrato -------------------------
    escribir_bloques(doc, BLOQUES, numerar_clausulas=True)

    # ------------------------------- Anexos --------------------------------
    doc.add_page_break()
    escribir_bloques(doc, ANEXOS, numerar_clausulas=False)

    # ------------------------------- Firmas --------------------------------
    doc.add_page_break()
    encabezado_seccion(doc, "FIRMAS")
    for tipo, dato in CIERRE:
        parrafo(doc, dato)

    firma(doc, ["EL PROVEEDOR", "EL CLIENTE"])

    parrafo(doc, "**Testigos**", justificar=False)
    firma(doc, ["Testigo 1", "Testigo 2"])

    parrafo(
        doc,
        f"**Versión {VERSION}** · Documento generado desde "
        "__docs/legal/servicios/contenido_contrato.py__.",
        justificar=False,
    )

    pie_de_pagina(doc, f"Contrato de Prestación de Servicios · Chekdor · v{VERSION}")

    doc.save(SALIDA)
    print(f"OK -> {SALIDA}")


if __name__ == "__main__":
    construir()
