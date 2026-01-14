# Contexto del proyecto

Quiero construir un clon simplificado de **Deuna** (billetera digital relacionada con Banco Pichincha) como proyecto para un taller universitario.

El objetivo principal es **emular el pago con QR desde el celular**, manejando dos saldos por usuario:

- `saldo_bp`: saldo de la cuenta Banco Pichincha (simulada).
- `saldo_deuna`: saldo de la billetera Deuna.

Regla clave de negocio:

- Si un usuario hace un pago desde Deuna y su `saldo_deuna` NO alcanza:
  1. Se recarga automáticamente desde `saldo_bp` el monto faltante.
  2. Se debita el monto total desde `saldo_deuna`.
  3. Se registra la transacción y se muestra un recibo.

Caso ejemplo:

- saldo_deuna = 0
- saldo_bp = 1500
- monto a pagar = 20

Flujo:
- Detecta que saldo_deuna (0) es insuficiente.
- Transfiere automáticamente 20 desde saldo_bp a saldo_deuna.
- saldo_bp queda en 1480, saldo_deuna en 20.
- Debita los 20 de saldo_deuna → saldo_deuna vuelve a 0.
- El receptor recibe los 20 en su saldo_deuna.
- Se muestra un comprobante con los nuevos saldos.

---

# Requerimientos generales

Quiero un proyecto **fullstack** con esta estructura:

- Backend:
  - Node.js + Express.
  - Base de datos: MongoDB (con Mongoose).
  - Autenticación simple con JWT.
  - Lógica de negocio para el pago con QR y la recarga automática desde saldo_bp a saldo_deuna.

- Frontend:
  - PWA (Progressive Web App) responsive, pensada para usarse desde el navegador del celular.
  - Framework sugerido: React (con Vite) o similar.
  - Estilos: TailwindCSS (preferible) o CSS simple.
  - Soporte para escanear QR usando la cámara del celular (por ejemplo `html5-qrcode` o similar en web).
  - UI inspirada en Deuna: botones grandes, enfoque en “Pagar QR” y “Cobrar QR”.

No necesito un producto de producción; es un **MVP educativo**, con código limpio y fácil de entender.

---

# Modelo de datos

Diseña los modelos en MongoDB (Mongoose) de forma clara.

## Usuario

Campos mínimos:

- `nombre` (string)
- `apellido` (string)
- `ci` (string, identificador único de cédula, no se muestra públicamente)
- `correo` (string, único)
- `password` (string, encriptada con bcrypt)
- `telefono` (string)
- `saldo_bp` (number, por ejemplo 1500.00)
- `saldo_deuna` (number, por ejemplo 0.00)
- `numero_cuenta` (string, 10 dígitos generados automáticamente, único. Se muestra enmascarado al usuario: `******3826`)
- `qr_code` (string, UUID v4 único generado automáticamente. Es el contenido interno del QR, no se muestra al usuario)
- timestamps de creación / actualización

### Estrategia de QR y número de cuenta

| Campo | Propósito | ¿Visible al usuario? |
|-------|-----------|---------------------|
| `numero_cuenta` | Identificador amigable tipo cuenta bancaria | Sí, enmascarado: `******XXXX` |
| `qr_code` | Contenido codificado dentro del QR (UUID) | No, es interno |

**Generación automática al registrar:**
- `numero_cuenta`: 10 dígitos aleatorios únicos.
- `qr_code`: UUID v4 único (ej: `f47ac10b-58cc-4372-a567-0e02b2c3d479`).

**Enmascarado en frontend:**
```javascript
// "2847593826" → "******3826"
const mascararCuenta = (numero) => '******' + numero.slice(-4);
```

## Transaccion

Campos mínimos:

- `tipo`: `"pago_qr"`, `"recarga"` u otros tipos si se necesitan.
- `emisor_id`: referencia al usuario que paga.
- `receptor_id`: referencia al usuario que cobra.
- `monto`: number.
- `fuente`: `"deuna"` o `"bp"` (de dónde salió finalmente el dinero).
- `recarga_automatica`: boolean (true si antes de pagar se hizo recarga automática desde saldo_bp).
- `estado`: `"completada"`, `"pendiente"`, `"fallida"`.
- `descripcion`: string opcional.
- timestamps.

---

# API backend deseada

Quiero que generes un backend con los siguientes endpoints REST básicos:

## Autenticación

- `POST /api/auth/register`
  - Registra un usuario con: nombre, apellido, ci, correo, teléfono, password.
  - Inicializa `saldo_bp` y `saldo_deuna` con valores por defecto (por ejemplo, 1500 y 0).
  - Genera `qr_code` basado en la cédula (ej: `USR-<ci>`).

- `POST /api/auth/login`
  - Recibe correo + password.
  - Devuelve JWT y datos básicos del usuario (incluyendo sus saldos).

## Usuario

- `GET /api/usuarios/me`
  - Devuelve datos del usuario autenticado y sus saldos (`saldo_bp`, `saldo_deuna`).

- `GET /api/usuarios/qr/:codigo`
  - Busca usuario por `qr_code`.
  - Sirve para que el backend resuelva qué usuario/comercio es el receptor cuando se escanea un QR.

## Pagos y recargas

- `POST /api/pagos/qr`
  - Body: `{ receptor_qr, monto }`.
  - Usa el usuario autenticado como emisor.
  - Lógica:
    - Buscar emisor por `req.userId`.
    - Buscar receptor por `receptor_qr`.
    - Si `saldo_deuna >= monto`, debitar directamente de `saldo_deuna`.
    - Si `saldo_deuna < monto`:
      - Calcular `faltante = monto - saldo_deuna`.
      - Verificar que `saldo_bp >= faltante`.
      - Si no alcanza, devolver error de saldo insuficiente.
      - Si alcanza:
        - Restar `faltante` de `saldo_bp`.
        - Sumar `faltante` a `saldo_deuna`.
        - Luego debitar el monto total de `saldo_deuna`.
      - Acreditar `monto` en `saldo_deuna` del receptor.
    - Registrar una Transaccion con la información adecuada y `recarga_automatica = true/false`.
    - Devolver:
      - datos de la transacción,
      - nuevos saldos del emisor (`saldo_bp`, `saldo_deuna`),
      - información básica del receptor.

- `GET /api/transacciones`
  - Lista las transacciones del usuario autenticado, tanto como emisor como receptor.

---

# Requerimientos de lógica y calidad de código

- Usa Mongoose con modelos separados en carpetas claras (por ejemplo `models/Usuario.js`, `models/Transaccion.js`).
- Separa rutas, controladores y servicios (por ejemplo `routes/`, `controllers/`, `services/`).
- Implementa la lógica de negocio de pagos en un **service** independiente (por ejemplo `services/pagoService.js`) y desde el controlador solo se orquesta.
- Usa middlewares para:
  - Autenticación con JWT.
  - Manejo básico de errores.
- Agrega comentarios breves solo donde sea necesario para entender la lógica principal.

---

# Frontend (PWA) deseado

Quiero un frontend sencillo pero limpio, pensado para móvil:

- Tech stack sugerido:
  - React + Vite.
  - TailwindCSS para estilos.
- Estructura básica de páginas:
  - `/login`:
    - Form simple de login (correo + password).
  - `/home`:
    - Mostrar saludo.
    - Tarjeta con:
      - `saldo_deuna` grande.
      - `saldo_bp` en menor tamaño.
    - Dos botones grandes:
      - “Pagar QR” (abre el escáner).
      - “Cobrar QR” (muestra el QR del usuario).
  - `/pagar`:
    - Escáner de QR usando cámara (por ejemplo con `html5-qrcode` dentro del navegador).
    - Una vez escaneado, mostrar nombre del receptor + input para el monto + botón “Confirmar pago”.
    - Consumir el endpoint `POST /api/pagos/qr`.
    - Redirigir a pantalla de recibo.
  - `/cobrar`:
    - Mostrar el QR del usuario (generado desde el backend o en frontend a partir de `qr_code`).
  - `/recibo/:id`:
    - Mostrar la info de la transacción y los nuevos saldos del usuario.

Estilos:

- Mobile-first, que se vea bien en pantallas pequeñas.
- Botones grandes y legibles.
- Inspiración en colores tipo:
  - Morado oscuro para acciones principales.
  - Verde/aguamarina como secundario.
  - Fondo blanco o gris muy claro.

---

# Lo que quiero que hagas ahora

1. Genera un **plan de archivos y carpetas** para todo el proyecto (backend y frontend) siguiendo lo anterior.
2. Propón el código inicial para:
   - El backend (servidor Express, conexión a MongoDB, modelos, rutas base).
   - El frontend (proyecto React + Vite, estructura de páginas y componentes principales).
3. Una vez generado el plan, **pregúntame** si quiero que generes el código de alguna parte específica (por ejemplo, primero backend completo, luego frontend).

Por favor:
- Respeta esta descripción.
- Mantén el código lo suficientemente simple para un proyecto universitario, pero con buena organización.
- Explica brevemente lo que haces en cada bloque importante.
