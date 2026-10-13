# Procedimiento de atención a vulneraciones de seguridad

> **Obligación de origen:** artículo 20 de la Ley Federal de Protección de
> Datos Personales en Posesión de los Particulares y **Cláusula Novena** del
> Contrato de Encargo de Tratamiento.
>
> **Alcance:** aplica a toda vulneración que afecte datos personales
> tratados por Chekdor **por cuenta de un cliente**. Si la afectación toca
> datos propios de Chekdor (facturación, prospectos, empleados propios), se
> aplica el mismo procedimiento, pero la notificación a la autoridad
> corresponde a Chekdor como responsable.
>
> Este documento es el que el Anexo B marca como pendiente. Al aprobarlo y
> asignar responsables, cambia su estado a `Implementada`.

Última actualización: 2026-10-11 · Aprobado por: ●

---

## 1. Qué cuenta como vulneración

Toda **pérdida, destrucción, acceso, uso, modificación o divulgación no
autorizados** de datos personales. Ejemplos concretos para este producto:

| Escenario | ¿Es vulneración? | Gravedad inicial |
|---|---|---|
| Un cliente ve la nómina de otro cliente por un fallo de aislamiento | **Sí, crítica** | Crítica |
| Se filtra `SUPABASE_SERVICE_ROLE_KEY` | **Sí, crítica** | Crítica (acceso total) |
| Un empleado de un cliente ve el recibo de un compañero | **Sí** | Alta |
| Un empleado de un cliente ve el resultado NOM-035 de un compañero | **Sí, sensible** | Alta |
| Se pierde un respaldo y no se puede restaurar | **Sí** | Alta |
| Un atacante obtiene la base de datos completa | **Sí, crítica** | Crítica |
| Un empleado de Chekdor consulta datos sin necesidad para el soporte | **Sí** | Media |
| Se envía un reporte de nómina al correo equivocado | **Sí** | Media |
| Un tag NFC perdido permite marcar por otra persona | **Sí** | Media |
| Un atacante hace fuerza bruta sobre `/login` y falla | No (pero se registra) | Informativo |

**Regla de decisión:** ante la duda, se trata como vulneración. El costo de
investigar un falso positivo es de minutos; el de no notificar a tiempo es
una sanción y una reclamación del cliente.

---

## 2. Plazos que no se pueden perder

| Plazo | Qué vence | Base |
|---|---|---|
| **Inmediato** | Contención: detener la causa | — |
| **24 horas** | Evaluación inicial completa y decisión de notificar | Interno |
| **72 horas** | **Notificación al cliente (responsable)** | Contrato, Cláusula Novena |
| **Inmediato tras notificar** | El cliente pone la información a disposición del titular | Art. 20 LFPDPPP |
| **5 días hábiles** | Informe de causa raíz y plan de acción al cliente | Interno |
| **30 días** | Cierre verificado y constancia | Interno |
| **5 años** | Conservación de la documentación del incidente | Contrato, Cláusula Novena |

El plazo de 72 horas corre **desde que Chekdor tiene conocimiento** del
hecho, no desde que lo confirma. Si un cliente reporta una posible
vulneración, ese es el momento de arrancar el reloj, aunque después resulte
que no había afectación. En ese caso se documenta el descarte.

---

## 3. Roles

| Rol | Quién | Responsabilidad |
|---|---|---|
| **Coordinador del incidente** | ● | Dirige la respuesta, decide la contención y firma la notificación |
| **Contacto técnico** | ● | Investiga el acceso, revisa la bitácora, aplica las medidas técnicas |
| **Contacto con clientes** | ● | Comunica al cliente afectado y da seguimiento |
| **Suplente** | ● | Sustituye a cualquiera de los anteriores en su ausencia |

Estos nombres, con su correo y teléfono, deben estar también en el Anexo B
del contrato y actualizarse cuando cambien.

---

## 4. Fases del procedimiento

### Fase 1 · Detección y registro inicial (dentro de 1 hora)

Al recibir el reporte, el Coordinador abre un registro con los datos
mínimos. Aún no se investiga: primero se anota.

```
INCIDENTE-AAAA-NNN

Detectado por:            ●
Fecha y hora del reporte: ●
Canal de detección:       ● (reporte de cliente / alerta / revisión interna / tercero)
Descripción inicial:      ●
Datos y titulares que podrían estar afectados (preliminar): ●
Clientes posiblemente afectados: ●
```

**Acciones inmediatas, sin investigar todavía:**

- No borrar evidencia: no reiniciar servicios, no rotar claves aún, no
  modificar registros hasta que el Contacto técnico lo indique.
- Restringir la conversación al personal con necesidad de saber.
- No comunicar nada al cliente sin la evaluación de la Fase 2.

### Fase 2 · Contención y evaluación (dentro de 24 horas)

**2.1 Contener.** Detener la causa sin destruir evidencia:

| Si el incidente es… | Acción de contención |
|---|---|
| Robo o filtración de credenciales | Rotar la credencial comprometida; invalidar sesiones activas |
| Fuga de `service_role` | Rotar la clave en el panel de Supabase; revisar los accesos realizados con ella |
| Fallo de aislamiento entre clientes | Desplegar la corrección; suspender temporalmente la función afectada si no hay corrección inmediata |
| Dispositivo perdido o robado | Desactivar el punto de marcaje y regenerar su token desde el panel |
| Correo enviado a destinatario equivocado | Solicitar la eliminación al destinatario; documentar la respuesta |
| Acceso indebido de personal interno | Revocar el acceso; preservar la bitácora |

**2.2 Evaluar.** Responder por escrito estas seis preguntas:

1. ¿Qué datos se vieron comprometidos? (categorías concretas, según el
   Anexo A del contrato)
2. ¿Incluyen **datos personales sensibles** (resultados NOM-035) o
   **patrimoniales** (CLABE, importes de nómina)?
3. ¿Cuántos titulares, aproximadamente?
4. ¿De cuántos clientes?
5. ¿Existe un riesgo real para los derechos patrimoniales o morales de los
   titulares? **Esta es la pregunta que define si hay que notificar.**
6. ¿Se puede demostrar que los datos están cifrados o inutilizables? Si el
   cifrado en reposo estuviera implementado y las claves no se
   comprometieron, el riesgo baja significativamente.

**2.3 Decidir.** La notificación al cliente es **obligatoria** cuando existe
un riesgo real para los derechos de los titulares. Se documenta también la
decisión de **no** notificar, con su fundamento.

### Fase 3 · Notificación al cliente (dentro de 72 horas)

Se envía al contacto de privacidad del cliente que consta en el Anexo C del
contrato, con copia al contacto de notificaciones. **Por escrito, por
correo electrónico, con acuse.**

Contenido obligatorio (Cláusula Novena, fracción II):

```
Asunto: [ACCIÓN REQUERIDA] Notificación de vulneración de seguridad · INCIDENTE-AAAA-NNN

1. Fecha y hora en que ocurrió o se detectó:
2. Naturaleza de la vulneración (qué pasó, en lenguaje llano):
3. Categorías y número aproximado de titulares afectados:
4. Categorías de datos comprometidos, señalando si son sensibles:
5. Medidas adoptadas para contener la vulneración y evitar que se repita:
6. Medidas que el titular puede adoptar para proteger sus intereses
   (redactadas para que el cliente las transmita tal cual):
7. Nombre, correo y teléfono del contacto de Chekdor para dar seguimiento:
```

**Reglas de la comunicación:**

- No se especula. Si un dato no se conoce, se dice "en investigación".
- No se minimiza ni se usan tecnicismos para suavizar el hecho.
- No se culpa al cliente ni a un tercero antes de tener la causa raíz.
- **No se le pide al cliente que no informe a los titulares.** La decisión
  de comunicar al titular es del cliente, como responsable; Chekdor solo
  puede recomendar y debe dejar constancia de que la decisión es suya.
- Se ofrece el texto sugerido para el titular, porque el cliente lo
  necesitará y no siempre sabe redactarlo.

### Fase 4 · Causa raíz y corrección (dentro de 5 días hábiles)

Informe al cliente con:

- Causa raíz técnica o humana.
- Por qué los controles existentes no lo detectaron antes.
- Corrección aplicada y **evidencia de que funciona**.
- Medidas preventivas para que no se repita.
- Fecha de cierre verificada.

### Fase 5 · Cierre y constancia (dentro de 30 días)

Documento final que incluye la línea de tiempo completa, las decisiones
tomadas, el informe de causa raíz y el plan de acción con responsables y
fechas. Se conserva **cinco años**.

---

## 5. Qué se conserva como evidencia

Se conserva en un expediente por incidente, con acceso restringido al
Coordinador y al suplente:

| Elemento | Formato |
|---|---|
| Registro inicial del incidente | El bloque de la Fase 1 |
| Extractos de la bitácora (`public.auditoria`) del periodo | CSV con la consulta y su fecha de ejecución |
| Logs del proveedor (accesos a la base de datos) | Exportación del panel |
| Correos y comunicaciones con el cliente | PDF con encabezados completos |
| Notificación enviada y su acuse de recibo | PDF |
| Informe de causa raíz y plan de acción | Documento |
| Constancia de cierre | Documento |
| Registro de la decisión de no notificar, si aplica | Documento con fundamento |

**Nunca** se incluyen en el expediente datos personales de los titulares
afectados más allá de lo indispensable para describir el incidente. El
expediente puede contener identificadores (número de empleado), pero no
CURP, NSS ni CLABE completos.

---

## 6. Plantilla de consulta a la bitácora

Para dimensionar el alcance de un incidente. Se ejecuta en el editor SQL de
Supabase **con el rol de servicio**, nunca desde la aplicación.

```sql
-- Acciones registradas en la ventana del incidente.
-- Ajusta las fechas y, si conoces el cliente, filtra por empresa_id.
select
    a.fecha,
    a.accion,
    a.empresa_id,
    a.usuario_id,
    a.empleado_afectado,
    a.ip,
    left(a.detalle::text, 300) as detalle
from public.auditoria a
where a.fecha between 'AAAA-MM-DD HH:MM:SS-06' and 'AAAA-MM-DD HH:MM:SS-06'
order by a.fecha;

-- Marcajes atípicos: volumen por empleado y hora, para detectar
-- inserción masiva no autorizada.
select
    r.empleado_id,
    date_trunc('hour', r.timestamp) as hora,
    count(*) as marcajes,
    count(distinct r.ip_origen) as ips
from public.registros_horarios r
where r.timestamp between 'AAAA-MM-DD' and 'AAAA-MM-DD'
group by 1, 2
having count(*) > 10
order by 3 desc;
```

**Limitación conocida:** `public.auditoria` registra las acciones de la
aplicación, no los accesos directos a la base de datos. Para esos casos hay
que recurrir a los *logs* del proveedor. Esta es la deficiencia número 4 del
inventario de medidas de seguridad.

---

## 7. Simulacro

Un procedimiento que nunca se ha practicado no funciona el día que se
necesita. Se recomienda un simulacro **cada seis meses**, con un escenario
sencillo:

1. Alguien del equipo (no el Coordinador) inventa un incidente creíble y lo
   reporta por el canal habitual.
2. El Coordinador ejecuta las fases 1 a 3 con cronómetro.
3. Se mide: ¿se detectó en menos de una hora? ¿se contuvo en 24? ¿la
   notificación salió dentro de las 72?
4. Se anota lo que falló y se corrige el procedimiento.

Escenarios sugeridos: fuga de la clave de servicio, correo de nómina a un
destinatario equivocado, y acceso de un cliente a datos de otro.

---

## 8. Pendientes para que este procedimiento esté vigente

| # | Pendiente | Responsable | Fecha |
|---|---|---|---|
| 1 | Asignar nombre, correo y teléfono a los cuatro roles de la sección 3 | ● | ● |
| 2 | Publicar los contactos de emergencia en un lugar accesible fuera del horario laboral | ● | ● |
| 3 | Aprobar formalmente este documento (firma del Coordinador) | ● | ● |
| 4 | Conectar los *logs* del proveedor de base de datos y documentar cómo consultarlos | ● | ● |
| 5 | Realizar el primer simulacro y documentarlo | ● | ● |
| 6 | Actualizar el Anexo B del contrato cambiando este rubro a `Implementada` | ● | ● |
