# Deuna Clone - Billetera Digital

Clon simplificado de Deuna para proyecto universitario.

## Estructura

- `backend/` - API REST con Node.js + Express + MongoDB
- `frontend/` - Aplicación React + Vite + TailwindCSS

## Deploy en Render

### Backend (Web Service)
1. Crear nuevo Web Service
2. Conectar repositorio
3. Configurar:
   - **Root Directory**: `deuna/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI` - String de conexión a MongoDB Atlas
     - `JWT_SECRET` - Secreto para tokens JWT (ej: `mi_secreto_super_seguro_2026`)
     - `FRONTEND_URL` - (Opcional) URL del frontend para CORS (ej: `https://deuna-app.onrender.com`)

### Frontend (Static Site)
1. Crear nuevo Static Site
2. Conectar repositorio
3. Configurar:
   - **Root Directory**: `deuna/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL` - URL del backend (ej: `https://deuna-api.onrender.com/api`)

## Desarrollo Local

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Funcionalidades

- ✅ Registro e inicio de sesión
- ✅ Visualización de saldos (Deuna y Banco Pichincha)
- ✅ Recarga desde Banco Pichincha a Deuna
- ✅ Pago mediante QR (escaneo o manual)
- ✅ Recarga automática al pagar si saldo insuficiente
- ✅ Historial de transacciones
- ✅ Generación de código QR personal

## 📡 API Endpoints

**Base URL**: `http://localhost:5000/api` (local) o `https://tu-app.onrender.com/api` (producción)

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Registrar usuario | `{ nombre, apellido, correo, telefono, password }` |
| `POST` | `/auth/login` | Iniciar sesión | `{ correo, password }` |

### 👤 Usuarios (`/api/usuarios`) - *Requiere Auth*

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `GET` | `/usuarios/me` | Obtener mi perfil | - |
| `GET` | `/usuarios/qr/:codigo` | Buscar usuario por QR | - |
| `POST` | `/usuarios/recargar` | Recargar desde BP a Deuna | `{ monto }` |

### 💸 Pagos (`/api/pagos`) - *Requiere Auth*

| Método | Endpoint | Descripción | Body |
|--------|----------|-------------|------|
| `POST` | `/pagos/qr` | Pagar a otro usuario | `{ receptor_qr, monto, descripcion? }` |

### 📋 Transacciones (`/api/transacciones`) - *Requiere Auth*

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/transacciones` | Listar mis transacciones |
| `GET` | `/transacciones/:id` | Detalle de una transacción |

### 🔑 Autenticación en Postman

Para endpoints protegidos, agrega el header:
```
Authorization: Bearer <token>
```

El `token` lo obtienes del response de `/auth/login` o `/auth/register`.

### 📝 Ejemplos de Request/Response

#### Registro
```json
// POST /api/auth/register
// Request
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@email.com",
  "telefono": "0999999999",
  "password": "123456"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "...",
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@email.com",
    "saldo_deuna": 0,
    "saldo_bp": 500,
    "codigo_qr": "DEUNA-ABC123"
  }
}
```

#### Pago QR
```json
// POST /api/pagos/qr
// Request
{
  "receptor_qr": "DEUNA-XYZ789",
  "monto": 25.50,
  "descripcion": "Almuerzo"
}

// Response
{
  "mensaje": "Pago realizado con éxito",
  "transaccion": { ... },
  "saldo_actual": 74.50
}
```
