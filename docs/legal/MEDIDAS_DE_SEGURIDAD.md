# Inventario de medidas de seguridad

> **Este documento es la fuente del Anexo B del Contrato de Encargo de
> Tratamiento.** Si cambias una medida aquí, actualiza el Anexo B y vuelve
> a generar el contrato.
>
> **Regla de oro:** una medida se marca `Implementada` **solo cuando puedes
> demostrarlo** señalando el archivo, la configuración o el registro que la
> sostiene. Un contrato que declara un control inexistente es, por sí
> mismo, un incumplimiento.

Última revisión: 2026-10-11 · Responsable: ●

---

## Cómo leer este inventario

| Estado | Significado |
|---|---|
| `Implementada` | Existe y se puede demostrar con evidencia verificable. |
| `Parcial` | Existe la capacidad técnica pero falta activarla, documentarla o exigirla. |
| `Pendiente` | No existe. Tiene fecha comprometida y responsable. |
| `No aplica` | No corresponde al modelo de operación de Chekdor. |

Ninguna medida debe figurar como `Implementada` si su columna de evidencia
está vacía.

---

## B.1 Medidas administrativas

### Implementadas

| Medida | Evidencia verificable |
|---|---|
| Política de privacidad y aviso de privacidad del Encargado | `docs/legal/Aviso_Privacidad_Encargado_Chekdor.docx`, publicado en el sitio |
| Registro de operaciones de tratamiento | Tabla `public.auditoria` (migración `0001_core_schema.sql`, líneas 177-187). Registra acción, usuario, registro afectado, detalle JSONB y fecha |
| Acuerdo de confidencialidad con el personal con acceso a datos | Cláusula de confidencialidad en el contrato individual de trabajo |
| Inventario de datos personales por módulo | Anexo A del contrato; refleja las migraciones `0001`, `0007`, `0008` y `0009` |
| Registro del consentimiento del titular con evidencia | Tabla `public.consentimientos`: guarda `ip`, `user_agent`, `metodo` y `fecha` |
| Procedimiento de canalización de solicitudes ARCO | Cláusula Séptima del contrato: canalización en 3 días hábiles |

### Con deficiencia conocida

| Medida | Estado | Qué falta |
|---|---|---|
| Registro de accesos privilegiados a la base de datos | **Parcial** | La tabla `auditoria` registra las acciones **de la aplicación**, no los accesos directos a la base de datos (por SQL, por el panel de Supabase o por un script con `service_role`). Falta activar los *logs* de conexión del proveedor y revisarlos. |

### Pendientes

| Medida | Fecha comprometida | Responsable |
|---|---|---|
| Capacitación anual en protección de datos personales, con constancia | ● | ● |
| Procedimiento interno escrito de atención a vulneraciones (ver `PROCEDIMIENTO_VULNERACIONES.md`) | ● | ● |
| Política documentada de retención y destrucción por tipo de dato | ● | ● |
| Designación formal y por escrito del responsable de seguridad de datos personales | ● | ● |
| Revisión semestral del inventario de encargados adicionales | ● | ● |

---

## B.2 Medidas técnicas

### Implementadas

| Medida | Evidencia verificable |
|---|---|
| Cifrado en tránsito | HTTPS/TLS forzado por la plataforma de despliegue. Toda comunicación al API de Supabase viaja por TLS |
| Autenticación de usuarios | `@supabase/ssr` con `getUser()` (validación contra el servidor, no `getSession()`). Contraseña mínima de 8 caracteres validada con Zod en `src/lib/actions/auth.ts` |
| Hashing de contraseñas | Delegado al servicio de autenticación de Supabase (bcrypt). La aplicación **nunca** ve ni almacena contraseñas en claro |
| Separación lógica por responsable | Row Level Security en todas las tablas con `empresa_id` (`0003_rls.sql`, `0010_nomina_rls.sql`). Los *helpers* `auth_empresa_id()` y `puede_administrar()` leen los claims del JWT, inyectados por el Auth Hook `custom_access_token_hook` (`0004_auth_hook.sql`) |
| Revocación de privilegios del rol anónimo | Migración `0006_revoke_anon.sql`. `anon` solo puede ejecutar `registrar_marcaje()` |
| Control de acceso por roles | `ROLES_ADMIN` y `exigirAdmin()` en `src/lib/auth.ts`. El rol se valida **en el servidor** en cada Server Action, no solo en la interfaz |
| Restricción de acceso a nómina | RLS de `0009`/`0010` más validación de rol en `src/app/(app)/contabilidad/export/route.ts` |
| Confidencialidad de los resultados NOM-035 | Política `nom035_res_select` corregida en la migración `0012`: solo el propio trabajador o un administrador |
| Credenciales de dispositivo con alta entropía | `crypto.randomUUID()` (122 bits) en `src/lib/actions/puntos.ts` |
| Control anti-fraude en el marcaje | Función `registrar_marcaje()` (migración `0012`): ventana temporal de ±5 minutos y rechazo de duplicados dentro de 60 segundos |
| Validación de formato de datos de identificación | CURP, RFC y NSS con expresión regular en `src/lib/actions/empleados.ts` |
| Limitación de intentos de inicio de sesión | Aplicada por Supabase Auth (rate limiting y bloqueo temporal) |
| Registro de errores sin datos personales | `error.tsx` y `console.error` de los Server Actions: registran mensaje y `digest`, no el contenido de los datos |
| Respaldo automático de la base de datos | Respaldos diarios administrados por Supabase |
| Aislamiento de secretos | `SUPABASE_SERVICE_ROLE_KEY` no aparece en ningún archivo de `src/`; solo en `.env.example` con la advertencia de uso exclusivo en backend |
| Eliminación en cascada al término | Restricciones `on delete cascade` en todas las tablas dependientes: al eliminar una empresa se eliminan sus empleados, marcajes, jornadas y recibos |

### Con deficiencia conocida

| Medida | Estado | Qué falta |
|---|---|---|
| Cifrado de datos personales en reposo a nivel de aplicación | **Parcial** | CURP, RFC, NSS y CLABE se guardan sin cifrado adicional. Están protegidos por el cifrado de disco del proveedor y por el control de acceso del motor de base de datos, pero **quien obtenga acceso a la base de datos los lee en claro**. Ver el plan de cierre abajo |
| Documentación de la bitácora de auditoría | **Parcial** | La tabla existe y se alimenta, pero no hay un procedimiento de revisión periódica ni alertas. Una bitácora que nadie lee no es un control |

### Pendientes

| Medida | Fecha comprometida | Responsable |
|---|---|---|
| Cifrado en reposo de CURP, RFC, NSS y CLABE | ● | ● |
| Autenticación de dos factores obligatoria para roles administrativos | ● | ● |
| Prueba documentada de restauración de respaldos | ● | ● |
| Prueba de penetración por tercero independiente | ● | ● |
| Revisión periódica de la bitácora de auditoría, con alertas | ● | ● |

---

## B.3 Medidas físicas

| Medida | Estado | Evidencia / qué falta |
|---|---|---|
| Control de acceso físico al centro de datos | Implementada | Delegado al subencargado de nube, que certifica los controles de sus instalaciones. Chekdor no opera centros de datos |
| Cifrado de disco en los equipos de trabajo | Implementada | Cifrado habilitado en los equipos del personal |
| Bloqueo de pantalla por inactividad | Implementada | Configurado en los equipos del personal |
| Prohibición de acceso a producción desde dispositivos no administrados | **Pendiente** | Falta la política escrita y su mecanismo de verificación. Fecha comprometida: ● |

---

## Plan de cierre de las deficiencias

Ordenado por riesgo real, no por facilidad. El cifrado en reposo va primero
porque es la única deficiencia que expone **datos personales en claro** si
alguien obtiene acceso a la base de datos.

| # | Deficiencia | Riesgo si no se cierra | Acción concreta |
|---|---|---|---|
| 1 | CURP, RFC, NSS y CLABE sin cifrar en reposo | Alto: acceso a la base = acceso a identificadores oficiales y cuentas bancarias | Cifrar con `pgcrypto` a nivel de columna, o guardar solo un hash para búsqueda más el valor cifrado. Requiere migración y cambio del motor de nómina |
| 2 | Sin 2FA para administradores | Alto: una contraseña filtrada da acceso a la nómina completa | Activar 2FA (TOTP) en Supabase Auth y **exigirlo** para `admin_empresa`, `rh` y `super_admin` |
| 3 | Sin procedimiento de vulneraciones | Medio-alto: se incumpliría el plazo de 72 horas por no saber qué hacer | Ya redactado en `PROCEDIMIENTO_VULNERACIONES.md`; falta asignar responsables y hacer un simulacro |
| 4 | Accesos privilegiados a la BD sin registro | Medio: no se puede investigar quién vio qué tras un incidente | Activar los *logs* de conexión del proveedor y documentar cómo consultarlos |
| 5 | Sin prueba de restauración de respaldos | Medio: un respaldo no probado no es un respaldo | Ejecutar una restauración en un proyecto de prueba y documentar el tiempo de recuperación |
| 6 | Sin política de retención y destrucción | Medio: incumplimiento del principio de temporalidad | Documentar plazos por tipo de dato (marcajes, nómina, NOM-035, ARCO) y automatizar la purga |
| 7 | Sin bitácora revisada | Bajo-medio | Definir una revisión mensual con lista de verificación |
| 8 | Capacitación del personal | Bajo-medio | Sesión anual con constancia firmada |

---

## Medidas que **no** se declaran (y por qué)

| Medida | Motivo |
|---|---|
| Certificación ISO 27001 | No iniciada. No debe figurar ni como "en trámite" |
| Distintivo de Confianza del INAI | No obtenido |
| NOM-151-SCFI (conservación de mensajes de datos) | No implementada. Aplica a la conservación de mensajes de datos con validez probatoria; la bitácora actual no la cumple |
| Cifrado de extremo a extremo | No aplica: el modelo requiere que el servidor calcule la nómina, así que los datos deben ser legibles en el servidor |
| WAF | No contratado. El proveedor de despliegue ofrece mitigación básica de DDoS, pero no es un WAF declarado |

---

## Cómo actualizar este documento

1. Cambia el estado de la medida y **agrega la evidencia** (ruta de archivo,
   migración, configuración). Sin evidencia, no cambies el estado.
2. Mueve la medida a la sección que corresponda a su nuevo estado.
3. Actualiza el Anexo B del contrato:
   ```bash
   python docs/legal/generar_contrato_encargo.py
   ```
4. Actualiza también el aviso de privacidad si la medida afecta lo que se
   declara a los titulares (por ejemplo, al activar el cifrado en reposo):
   ```bash
   python docs/legal/generar_aviso_privacidad_encargado.py
   ```
5. Anota la fecha de revisión al inicio de este archivo.
