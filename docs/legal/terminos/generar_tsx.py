"""
Genera la página pública /terminos (TSX) desde la fuente única.

Uso:
    python docs/legal/terminos/generar_tsx.py

Salida:
    src/app/terminos/page.tsx

⚠️ No edites el TSX generado a mano: el siguiente que ejecute este script
sobrescribirá tus cambios. Edita contenido_terminos.py.

El marcado en línea de la fuente (**negrita**, __cursiva__) se traduce al
equivalente de React. Por eso el TSX es un archivo de datos y no de JSX
escrito a mano: garantiza que diga exactamente lo mismo que el Word.
"""

import sys
from pathlib import Path

AQUI = Path(__file__).parent
sys.path.insert(0, str(AQUI))

from contenido_terminos import (  # noqa: E402
    BLOQUES,
    CIERRE,
    CORREO_LEGAL,
    CORREO_PRIVACIDAD,
    SUBTITULO,
    TITULO,
    VERSION,
    VIGENTE_DESDE,
)

RAIZ = AQUI.parent.parent.parent
SALIDA = RAIZ / "src" / "app" / "terminos" / "page.tsx"


def ts(texto: str) -> str:
    """Escapa un literal para incrustarlo en un string de TypeScript."""
    return (
        texto.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
    )


def tipo_bloque(bloque: tuple) -> str:
    """Convierte un bloque de Python en un literal de TypeScript."""
    tipo, dato = bloque

    if tipo == "h":
        return f'  {{ tipo: "h", texto: "{ts(dato)}" }},'

    if tipo == "p":
        return f'  {{ tipo: "p", texto: "{ts(dato)}" }},'

    if tipo in ("ul", "ol"):
        items = "".join(f'\n      "{ts(i)}",' for i in dato)
        return f'  {{ tipo: "{tipo}", items: [{items}\n    ] }},'

    if tipo == "tabla":
        encabezados, filas = dato
        enc = "".join(f'\n      "{ts(e)}",' for e in encabezados)
        cuerpo = "".join(
            "\n    ["
            + "".join(f'\n      "{ts(c)}",' for c in fila)
            + "\n    ],"
            for fila in filas
        )
        return (
            f'  {{ tipo: "tabla", encabezados: [{enc}\n    ],\n    filas: [{cuerpo}\n    ] }},'
        )

    if tipo == "aviso":
        titulo, texto, tono = dato
        return (
            f'  {{ tipo: "aviso", titulo: "{ts(titulo)}", texto: "{ts(texto)}", '
            f'tono: "{tono or "ambar"}" }},'
        )

    raise ValueError(f"Tipo de bloque desconocido: {tipo}")


def construir() -> None:
    bloques_ts = "\n".join(tipo_bloque(b) for b in BLOQUES)
    cierre_ts = "\n".join(tipo_bloque(b) for b in CIERRE)

    # El desarrollador debe saber que el archivo es generado.
    aviso_generado = (
        "// =====================================================================\n"
        "// ARCHIVO GENERADO — NO LO EDITES A MANO\n"
        "//\n"
        "// Se produce con:\n"
        "//     python docs/legal/terminos/generar_tsx.py\n"
        "//\n"
        "// La fuente del texto es docs/legal/terminos/contenido_terminos.py,\n"
        "// que también genera el .docx de los Términos. Editar este archivo\n"
        "// provoca que la página y el documento firmado digan cosas distintas.\n"
        "// =====================================================================\n"
    )

    contenido = f'''{aviso_generado}
import type {{ Metadata }} from "next";
import Link from "next/link";
import Image from "next/image";
import {{ AlertTriangle, ArrowLeft }} from "lucide-react";

export const metadata: Metadata = {{
  title: "Términos y condiciones de servicio",
  description:
    "Términos y condiciones de uso de Chekdor: qué hace y qué no hace el servicio, obligaciones del cliente, uso aceptable, propiedad de los datos, disponibilidad, limitación de responsabilidad y ley aplicable.",
  alternates: {{ canonical: "/terminos" }},
}};

// ---------------------------------------------------------------------
// Contenido
// ---------------------------------------------------------------------
type Bloque =
  | {{ tipo: "h"; texto: string }}
  | {{ tipo: "p"; texto: string }}
  | {{ tipo: "ul"; items: string[] }}
  | {{ tipo: "ol"; items: string[] }}
  | {{ tipo: "tabla"; encabezados: string[]; filas: string[][] }}
  | {{ tipo: "aviso"; titulo: string; texto: string; tono: string }};

const BLOQUES: Bloque[] = [
{bloques_ts}
];

const CIERRE: Bloque[] = [
{cierre_ts}
];

const VERSION = "{ts(VERSION)}";
const VIGENTE_DESDE = "{ts(VIGENTE_DESDE)}";

// ---------------------------------------------------------------------
// Traducción del marcado en línea a React
// ---------------------------------------------------------------------
/**
 * Convierte **negritas** y __cursiva__ en nodos de React.
 *
 * El texto viene de la fuente única en Python y solo contiene esas dos
 * marcas, así que se procesan con una expresión regular y sin
 * `dangerouslySetInnerHTML`.
 */
function conMarcado(texto: string, clave: string): React.ReactNode {{
  const partes = texto.split(/(\\*\\*.+?\\*\\*|__.+?__)/g);
  return partes.map((parte, i) => {{
    if (parte.startsWith("**") && parte.endsWith("**")) {{
      return <strong key={{`${{clave}}-${{i}}`}}>{{parte.slice(2, -2)}}</strong>;
    }}
    if (parte.startsWith("__") && parte.endsWith("__")) {{
      return <em key={{`${{clave}}-${{i}}`}}>{{parte.slice(2, -2)}}</em>;
    }}
    return parte;
  }});
}}

// ---------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------
function BloqueRender({{ bloque, indice, numero }}: {{
  bloque: Bloque;
  indice: number;
  numero: number;
}}) {{
  const clave = `b${{indice}}`;
  if (bloque.tipo === "h") {{
    return (
      <h2 className="mt-10 scroll-mt-24 text-lg font-bold text-slate-900">
        {{`${{numero}}. ${{bloque.texto}}`}}
      </h2>
    );
  }}

  if (bloque.tipo === "p") {{
    return (
      <p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
        {{conMarcado(bloque.texto, clave)}}
      </p>
    );
  }}

  if (bloque.tipo === "ul") {{
    return (
      <ul className="mt-3 ml-5 list-disc space-y-1.5 text-sm leading-relaxed text-slate-700 sm:text-base">
        {{bloque.items.map((item, i) => (
          <li key={{`${{clave}}-${{i}}`}}>{{conMarcado(item, `${{clave}}-${{i}}`)}}</li>
        ))}}
      </ul>
    );
  }}

  if (bloque.tipo === "ol") {{
    return (
      <ol className="mt-3 ml-5 list-decimal space-y-1.5 text-sm leading-relaxed text-slate-700 sm:text-base">
        {{bloque.items.map((item, i) => (
          <li key={{`${{clave}}-${{i}}`}}>{{conMarcado(item, `${{clave}}-${{i}}`)}}</li>
        ))}}
      </ol>
    );
  }}

  if (bloque.tipo === "tabla") {{
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {{bloque.encabezados.map((e, i) => (
                <th key={{i}} className="px-4 py-2.5 font-medium">
                  {{e}}
                </th>
              ))}}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {{bloque.filas.map((fila, i) => (
              <tr key={{i}}>
                {{fila.map((celda, j) => (
                  <td key={{j}} className="px-4 py-2.5 align-top text-slate-700">
                    {{conMarcado(celda, `${{clave}}-${{i}}-${{j}}`)}}
                  </td>
                ))}}
              </tr>
            ))}}
          </tbody>
        </table>
      </div>
    );
  }}

  // Aviso
  const tono =
    bloque.tono === "rojo"
      ? "border-red-200 bg-red-50 text-red-900"
      : bloque.tono === "azul"
        ? "border-blue-200 bg-blue-50 text-blue-900"
        : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <div className={{`mt-4 rounded-xl border p-4 ${{tono}}`}}>
      <p className="font-semibold">{{bloque.titulo}}</p>
      <p className="mt-1 text-sm leading-relaxed">
        {{conMarcado(bloque.texto, clave)}}
      </p>
    </div>
  );
}}

// ---------------------------------------------------------------------
// Numeración de secciones
// ---------------------------------------------------------------------
/**
 * Asigna el número consecutivo a cada encabezado.
 *
 * El número de una sección es la CANTIDAD de encabezados anteriores más uno,
 * no el número del bloque anterior: si se usara el del bloque anterior, todos
 * los títulos quedarían numerados como 1 porque el bloque previo suele ser un
 * párrafo (que vale 0).
 *
 * Se calcula a nivel de módulo y sin variables mutables, porque mutar una
 * variable durante el render es un antipatrón de React (y el lint del
 * proyecto lo rechaza).
 */
const SECCIONES: {{ bloque: Bloque; indice: number; numero: number }}[] =
  BLOQUES.reduce<{{ bloque: Bloque; indice: number; numero: number }}[]>(
    (acumulado, bloque, indice) => {{
      const encabezadosPrevios = BLOQUES.slice(0, indice).filter(
        (b) => b.tipo === "h",
      ).length;
      return [
        ...acumulado,
        {{
          bloque,
          indice,
          numero: bloque.tipo === "h" ? encabezadosPrevios + 1 : 0,
        }},
      ];
    }},
    [],
  );

export default function TerminosPage() {{
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/chekdor.png"
              alt="Chekdor"
              width={{28}}
              height={{28}}
              className="h-7 w-7"
            />
            <span className="font-bold text-blue-700">Chekdor</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Términos y condiciones de servicio
        </h1>
        <p className="mt-1 text-slate-500">
          Chekdor · Sistema de control de asistencia, cálculo de nómina y exportación
          contable
        </p>

        {{SECCIONES.map(({{ bloque, indice, numero }}) => (
          <BloqueRender
            key={{indice}}
            bloque={{bloque}}
            indice={{indice}}
            numero={{numero}}
          />
        ))}}

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          {{CIERRE.map((bloque, i) => (
            <BloqueRender key={{`c${{i}}`}} bloque={{bloque}} indice={{1000 + i}} numero={{0}} />
          ))}}
          <p className="mt-2">
            <strong>Versión:</strong> {{VERSION}} · <strong>Entrada en vigor:</strong>{" "}
            {{VIGENTE_DESDE}}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Volver al inicio
          </Link>
          <Link
            href="/privacidad-encargado"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Aviso de privacidad
          </Link>
          <a
            href="mailto:{ts(CORREO_LEGAL)}"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Escribir a {ts(CORREO_LEGAL)}
          </a>
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs text-slate-500">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Para dudas sobre protección de datos personales, escribe a{" "}
            <a href="mailto:{ts(CORREO_PRIVACIDAD)}" className="underline">
              {ts(CORREO_PRIVACIDAD)}
            </a>
            . El tratamiento de datos personales se rige además por el Contrato de Encargo
            de Tratamiento que Chekdor suscribe con cada cliente.
          </span>
        </p>
      </main>
    </div>
  );
}}
'''

    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(contenido, encoding="utf-8")
    print(f"OK -> {SALIDA}")


if __name__ == "__main__":
    construir()
