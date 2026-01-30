# 📘 API REST - Sistema de Depósitos Banco Pichincha

## 🌐 Información General

- **Base URL (Local)**: `http://localhost:8000`
- **Base URL (Producción)**: `https://banco-pichincha-api.onrender.com`
- **Documentación Swagger**: `/docs`
- **Documentación ReDoc**: `/redoc`
- **Versión**: 1.0.0

## 📋 Índice

- [Autenticación](#autenticación)
- [Endpoints de Depósitos](#endpoints-de-depósitos)
- [Endpoints de Cuentas](#endpoints-de-cuentas)
- [Endpoints de Cajeros](#endpoints-de-cajeros)
- [Códigos de Estado](#códigos-de-estado)
- [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🔐 Autenticación

Actualmente la API no requiere autenticación. En producción se recomienda implementar JWT o OAuth2.

---

## 💰 Endpoints de Depósitos

### 1. Obtener Estadísticas de Depósitos

Obtiene un resumen general con totales, promedios y distribución por canal/estado.

**Endpoint**: `GET /api/depositos/estadisticas/resumen`

**Parámetros Query** (opcionales):
- `fecha_desde` (date): Fecha inicial del rango
- `fecha_hasta` (date): Fecha final del rango

**Respuesta Exitosa** (200):
```json
{
  "total_depositos": 30,
  "monto_total": 124650.00,
  "promedio_deposito": 4155.00,
  "por_canal": [
    {
      "canal": "VENTANILLA",
      "cantidad": 10,
      "monto_total": 86300.00
    },
    {
      "canal": "BANCA_WEB",
      "cantidad": 5,
      "monto_total": 14850.00
    }
  ],
  "por_estado": [
    {
      "estado": "PROCESADO",
      "cantidad": 27,
      "monto_total": 97350.00
    },
    {
      "estado": "PENDIENTE",
      "cantidad": 2,
      "monto_total": 17500.00
    }
  ]
}
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/depositos/estadisticas/resumen"
```

---

### 2. Listar Depósitos

Obtiene una lista de depósitos con información completa (joins con cuentas, personas, cajeros).

**Endpoint**: `GET /api/depositos/`

**Parámetros Query** (opcionales):
- `skip` (int): Número de registros a omitir (default: 0)
- `limit` (int): Máximo de registros (default: 100, max: 100)
- `canal_deposito` (string): Filtrar por canal
- `estado` (string): Filtrar por estado
- `fecha_desde` (date): Fecha inicial
- `fecha_hasta` (date): Fecha final
- `id_cuenta` (int): Filtrar por cuenta

**Respuesta Exitosa** (200):
```json
[
  {
    "id_deposito": 1,
    "id_cuenta_destino": 1,
    "id_cajero": null,
    "id_persona_deposita": 1,
    "monto": 100.00,
    "moneda": "USD",
    "canal_deposito": "VENTANILLA",
    "tipo_deposito": "EFECTIVO",
    "fecha_deposito": "2026-01-29T10:30:00",
    "fecha_procesamiento": null,
    "estado": "PENDIENTE",
    "numero_comprobante": "DEP-20260129-000001",
    "observaciones": null,
    "usuario_registro": "SISTEMA",
    "ip_origen": "0.0.0.0",
    "cuenta_numero": "2200001001",
    "persona_nombre": "Juan Pérez",
    "cajero_nombre": null
  }
]
```

**Ejemplo cURL**:
```bash
# Listar todos
curl -X GET "http://localhost:8000/api/depositos/"

# Filtrar por estado PENDIENTE
curl -X GET "http://localhost:8000/api/depositos/?estado=PENDIENTE"

# Filtrar por canal y cuenta
curl -X GET "http://localhost:8000/api/depositos/?canal_deposito=VENTANILLA&id_cuenta=1"
```

---

### 3. Obtener Depósito por ID

Obtiene un depósito específico con información completa.

**Endpoint**: `GET /api/depositos/{id_deposito}`

**Parámetros Path**:
- `id_deposito` (int): ID del depósito

**Respuesta Exitosa** (200):
```json
{
  "id_deposito": 1,
  "id_cuenta_destino": 1,
  "id_cajero": null,
  "id_persona_deposita": 1,
  "monto": 100.00,
  "moneda": "USD",
  "canal_deposito": "VENTANILLA",
  "tipo_deposito": "EFECTIVO",
  "fecha_deposito": "2026-01-29T10:30:00",
  "fecha_procesamiento": null,
  "estado": "PENDIENTE",
  "numero_comprobante": "DEP-20260129-000001",
  "observaciones": null,
  "usuario_registro": "SISTEMA",
  "ip_origen": "0.0.0.0",
  "cuenta_numero": "2200001001",
  "persona_nombre": "Juan Pérez",
  "cajero_nombre": null
}
```

**Respuesta Error** (404):
```json
{
  "detail": "Depósito no encontrado"
}
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/depositos/1"
```

---

### 4. Crear Depósito

Crea un nuevo depósito con validaciones de negocio.

**Endpoint**: `POST /api/depositos/`

**Reglas de Negocio**:
- Cuenta debe existir y estar activa
- Monto mínimo: EFECTIVO=$1, CHEQUE=$10
- Límites diarios por canal:
  - CAJERO_AUTOMATICO: $5,000
  - APP_MOVIL: $10,000
  - BANCA_WEB: $20,000
  - VENTANILLA: $50,000
  - CORRESPONSAL: $3,000
- Si canal es CAJERO_AUTOMATICO, se requiere id_cajero

**Body** (JSON):
```json
{
  "id_cuenta": 1,
  "monto": 100.00,
  "canal_deposito": "VENTANILLA",
  "tipo_deposito": "EFECTIVO",
  "id_cajero": null,
  "observaciones": "Depósito en efectivo"
}
```

**Respuesta Exitosa** (201):
```json
{
  "id_deposito": 31,
  "id_cuenta_destino": 1,
  "id_cajero": null,
  "id_persona_deposita": 1,
  "monto": 100.00,
  "moneda": "USD",
  "canal_deposito": "VENTANILLA",
  "tipo_deposito": "EFECTIVO",
  "fecha_deposito": "2026-01-29T10:30:00",
  "fecha_procesamiento": null,
  "estado": "PENDIENTE",
  "numero_comprobante": "DEP-20260129-000031",
  "observaciones": "Depósito en efectivo",
  "usuario_registro": "SISTEMA",
  "ip_origen": "0.0.0.0"
}
```

**Respuestas Error**:
- **400**: Validación fallida
```json
{
  "detail": "Límite diario excedido para VENTANILLA. Límite: $50,000.00, Acumulado hoy: $48,000.00"
}
```
- **404**: Cuenta no encontrada
```json
{
  "detail": "Cuenta no encontrada"
}
```

**Ejemplo cURL**:
```bash
curl -X POST "http://localhost:8000/api/depositos/" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cuenta": 1,
    "monto": 100.00,
    "canal_deposito": "VENTANILLA",
    "tipo_deposito": "EFECTIVO",
    "observaciones": "Depósito en efectivo"
  }'
```

---

### 5. Actualizar Estado de Depósito

Actualiza el estado de un depósito (solo si está en estado PENDIENTE).

**Endpoint**: `PUT /api/depositos/{id_deposito}`

**Parámetros Path**:
- `id_deposito` (int): ID del depósito

**Body** (JSON):
```json
{
  "estado": "PROCESADO",
  "observaciones": "Depósito verificado y procesado"
}
```

**Estados válidos**:
- `PENDIENTE`: Pendiente de procesamiento
- `PROCESADO`: Procesado exitosamente
- `RECHAZADO`: Rechazado por algún motivo

**Respuesta Exitosa** (200):
```json
{
  "id_deposito": 1,
  "id_cuenta_destino": 1,
  "monto": 100.00,
  "estado": "PROCESADO",
  "fecha_procesamiento": "2026-01-29T11:00:00",
  ...
}
```

**Respuesta Error** (400):
```json
{
  "detail": "Solo se pueden actualizar depósitos en estado PENDIENTE. Estado actual: PROCESADO"
}
```

**Ejemplo cURL**:
```bash
curl -X PUT "http://localhost:8000/api/depositos/1" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "PROCESADO",
    "observaciones": "Depósito verificado"
  }'
```

---

### 6. Eliminar Depósito

Elimina un depósito (solo si está en estado PENDIENTE).

**Endpoint**: `DELETE /api/depositos/{id_deposito}`

**Parámetros Path**:
- `id_deposito` (int): ID del depósito

**Respuesta Exitosa** (204): Sin contenido

**Respuesta Error** (400):
```json
{
  "detail": "Solo se pueden eliminar depósitos en estado PENDIENTE"
}
```

**Ejemplo cURL**:
```bash
curl -X DELETE "http://localhost:8000/api/depositos/1"
```

---

## 🏦 Endpoints de Cuentas

### 1. Validar Cuenta por Número

Valida una cuenta y retorna información del titular (enmascarada por seguridad).

**Endpoint**: `GET /api/cuentas/validar/{numero_cuenta}`

**Parámetros Path**:
- `numero_cuenta` (int): Número de cuenta a validar

**Respuesta Exitosa** (200):
```json
{
  "id_cuenta": 1,
  "n_cuenta": 2200001001,
  "tipo_cuenta": "AHORROS",
  "estado": "Activa",
  "titular_nombre": "Juan Pérez",
  "titular_cedula": "******5678",
  "titular_correo": "j*********@mail.com",
  "puede_recibir_depositos": true,
  "mensaje": "Cuenta válida. Titular: Juan Pérez"
}
```

**Respuestas Error**:
- **404**: Cuenta no encontrada
```json
{
  "detail": "Cuenta no encontrada. Verifique el número ingresado."
}
```
- **400**: Cuenta no activa
```json
{
  "detail": "La cuenta no está disponible para recibir depósitos. Estado: Bloqueada"
}
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/cuentas/validar/2200001001"
```

---

### 2. Listar Cuentas

Lista todas las cuentas activas.

**Endpoint**: `GET /api/cuentas/`

**Parámetros Query** (opcionales):
- `estado` (string): Filtrar por estado (default: "Activa")

**Respuesta Exitosa** (200):
```json
[
  {
    "id_cuenta": 1,
    "n_cuenta": 2200001001,
    "tipo_cuenta": "AHORROS",
    "estado": "Activa",
    "saldo_actual": 5200.50
  },
  {
    "id_cuenta": 2,
    "n_cuenta": 2200001002,
    "tipo_cuenta": "CORRIENTE",
    "estado": "Activa",
    "saldo_actual": 12500.00
  }
]
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/cuentas/"
```

---

### 3. Obtener Cuenta por ID

Obtiene una cuenta específica por su ID.

**Endpoint**: `GET /api/cuentas/{id_cuenta}`

**Parámetros Path**:
- `id_cuenta` (int): ID de la cuenta

**Respuesta Exitosa** (200):
```json
{
  "id_cuenta": 1,
  "n_cuenta": 2200001001,
  "tipo_cuenta": "AHORROS",
  "estado": "Activa",
  "saldo_actual": 5200.50
}
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/cuentas/1"
```

---

## 🏧 Endpoints de Cajeros

### 1. Listar Cajeros Activos

Lista todos los cajeros automáticos activos que permiten depósitos.

**Endpoint**: `GET /api/cajeros/`

**Respuesta Exitosa** (200):
```json
[
  {
    "id_cajero": 1,
    "nombre": "Cajero Mall El Jardín",
    "ciudad": "Quito",
    "provincia": "Pichincha",
    "direccion": "Av. Amazonas y Naciones Unidas",
    "activo": true,
    "depositos_enabled": true
  },
  {
    "id_cajero": 2,
    "nombre": "Cajero Centro Histórico",
    "ciudad": "Quito",
    "provincia": "Pichincha",
    "direccion": "Plaza Grande",
    "activo": true,
    "depositos_enabled": true
  }
]
```

**Ejemplo cURL**:
```bash
curl -X GET "http://localhost:8000/api/cajeros/"
```

---

## 📊 Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| **200** | OK - Solicitud exitosa |
| **201** | Created - Recurso creado exitosamente |
| **204** | No Content - Eliminación exitosa |
| **400** | Bad Request - Error de validación |
| **404** | Not Found - Recurso no encontrado |
| **422** | Unprocessable Entity - Error de validación de Pydantic |
| **500** | Internal Server Error - Error del servidor |

---

## 🔧 Ejemplos de Uso

### Ejemplo completo: Crear un depósito

#### Paso 1: Validar la cuenta destino
```bash
curl -X GET "http://localhost:8000/api/cuentas/validar/2200001001"
```

#### Paso 2: Verificar cajeros disponibles (si es depósito en cajero)
```bash
curl -X GET "http://localhost:8000/api/cajeros/"
```

#### Paso 3: Crear el depósito
```bash
curl -X POST "http://localhost:8000/api/depositos/" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cuenta": 1,
    "monto": 500.00,
    "canal_deposito": "CAJERO_AUTOMATICO",
    "tipo_deposito": "EFECTIVO",
    "id_cajero": 1,
    "observaciones": "Depósito desde cajero del mall"
  }'
```

#### Paso 4: Verificar el depósito creado
```bash
curl -X GET "http://localhost:8000/api/depositos/31"
```

---

### Ejemplo con Python (requests)

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Validar cuenta
response = requests.get(f"{BASE_URL}/api/cuentas/validar/2200001001")
cuenta = response.json()
print(f"Titular: {cuenta['titular_nombre']}")

# 2. Crear depósito
deposito_data = {
    "id_cuenta": cuenta["id_cuenta"],
    "monto": 150.00,
    "canal_deposito": "VENTANILLA",
    "tipo_deposito": "EFECTIVO",
    "observaciones": "Depósito de prueba"
}

response = requests.post(
    f"{BASE_URL}/api/depositos/",
    json=deposito_data
)

if response.status_code == 201:
    deposito = response.json()
    print(f"✅ Depósito creado: {deposito['numero_comprobante']}")
else:
    print(f"❌ Error: {response.json()['detail']}")
```

---

### Ejemplo con JavaScript (Axios)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:8000';

async function crearDeposito() {
  try {
    // 1. Validar cuenta
    const cuentaRes = await axios.get(
      `${BASE_URL}/api/cuentas/validar/2200001001`
    );
    console.log(`Titular: ${cuentaRes.data.titular_nombre}`);

    // 2. Crear depósito
    const depositoRes = await axios.post(
      `${BASE_URL}/api/depositos/`,
      {
        id_cuenta: cuentaRes.data.id_cuenta,
        monto: 200.00,
        canal_deposito: 'APP_MOVIL',
        tipo_deposito: 'EFECTIVO',
        observaciones: 'Depósito desde app móvil'
      }
    );

    console.log(`✅ Depósito creado: ${depositoRes.data.numero_comprobante}`);
  } catch (error) {
    console.error(`❌ Error: ${error.response.data.detail}`);
  }
}

crearDeposito();
```

---

## 📝 Notas Adicionales

### Canales de Depósito Válidos
- `CAJERO_AUTOMATICO` (requiere id_cajero)
- `VENTANILLA`
- `APP_MOVIL`
- `BANCA_WEB`
- `CORRESPONSAL`

### Tipos de Depósito Válidos
- `EFECTIVO` (monto mínimo: $1.00)
- `CHEQUE` (monto mínimo: $10.00)
- `TRANSFERENCIA`

### Estados de Depósito
- `PENDIENTE`: Recién creado, pendiente de procesamiento
- `PROCESADO`: Verificado y aprobado
- `RECHAZADO`: Rechazado por algún motivo

---

## 🚀 Deploy en Render

### Backend (API)
1. Push a GitHub
2. Crear Web Service en Render
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Agregar variables de entorno:
   - `DATABASE_URL`
   - `PYTHON_VERSION=3.14.0`

### Frontend (React)
1. Actualizar `.env.production` con URL del backend
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Deployar en Render Static Site

---

## 📞 Soporte

- **Email**: grupo2@bancop ichincha.com
- **GitHub**: https://github.com/tu-repo
- **Swagger**: http://localhost:8000/docs

---

**Grupo 2 - Depósitos | Banco Pichincha | 2026**
