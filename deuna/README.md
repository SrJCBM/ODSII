# 💰 Deuna - Billetera Digital

Sistema completo de billetera digital con servicios de **TRANSFERIR** y **RECARGA**, consultas avanzadas y auditoría completa.

> **Proyecto:** Examen ODSII - Servicios Bancarios  
> **Fecha:** Febrero 2026  
> **Stack:** MongoDB + Express + React + Node.js

---

## 🚀 Demo en Vivo

- **Frontend:** https://deuna-frontend.onrender.com
- **Backend API:** https://deuna-backend-r7lw.onrender.com
- **Repositorio:** https://github.com/SrJCBM/ODSII

**Credenciales de prueba:**
- Email: `jcblaciomachuca@gmail.com`
- Password: `Julio38_`

---

## 📋 Objetivos del Examen

| Componente | Puntos | Estado | Descripción |
|------------|--------|--------|-------------|
| **Base de Datos** | 6 pts | ✅ | 5 modelos (Usuario, Cuenta, Tarjeta, Transacción, Auditoría) con 10+ registros |
| **Backend/Lógica** | 7 pts | ✅ | API REST con TRANSFERIR, RECARGA y consultas avanzadas |
| **Frontend** | 2 pts | ✅ | Interfaz para transferencias y recargas |
| **TOTAL** | **15 pts** | ✅ | **Completo** |

---

## 🏗️ Arquitectura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │◄────►│   Express   │◄────►│  MongoDB    │
│  Frontend   │ HTTP │   Backend   │      │   Atlas     │
│ (Vite+Tail) │      │  REST API   │      │ (Database)  │
└─────────────┘      └─────────────┘      └─────────────┘
     ↓                      ↓                     ↓
  Render              Render               Cloud (Atlas)
(Static Site)      (Web Service)
```

---

## 📊 Modelos de Base de Datos

### 🔍 Ver Modelo Físico (Diagrama ER)

**Generar diagrama:**
```bash
node backend/scripts/generarDiagramaER.js
```

Esto crea [DIAGRAMA-ER.md](DIAGRAMA-ER.md) con diagrama Mermaid completo.

**Visualizar:**
1. **Mermaid Live:** https://mermaid.live (copiar código)
2. **VS Code:** Instalar extensión "Markdown Preview Mermaid Support" + Ctrl+Shift+V
3. **GitHub:** El diagrama se renderiza automáticamente al subir el archivo
4. **MongoDB Compass:** Ver estructura real → Colección → Tab "Schema"

---

### Usuario (Cliente del Banco)
```javascript
{
  nombre, apellido, ci, correo, password,
  telefono, numero_cuenta, qr_code,
  saldo_deuna, saldo_bp,  // Dos balances
  estado, direccion
}
```
**Registros:** 12 usuarios con datos realistas

### Cuenta
```javascript
{
  usuario_id, numero_cuenta, tipo_cuenta,
  banco (DEUNA/BP), saldo, estado,
  limite_diario, fecha_apertura
}
```
**Registros:** 20 cuentas (cada usuario tiene Deuna + BP)  
**Relación:** Usuario (1:N) Cuenta

### Tarjeta
```javascript
{
  cuenta_id, usuario_id, numero_tarjeta,
  tipo (debito/credito), marca (visa/mastercard),
  cvv_hash, fecha_expiracion, limite_credito, estado
}
```
**Registros:** 12 tarjetas  
**Relaciones:** Usuario (1:N) Tarjeta, Cuenta (1:N) Tarjeta

### Transacción
```javascript
{
  emisor_id, receptor_id, tipo, monto, comision, monto_total,
  estado (pendiente/completada/fallida/reversada/expirada),
  numero_transaccion, descripcion, expira_en
}
```
**Registros:** 15+ transacciones con estados completos  
**Relaciones:** Usuario (emisor 1:N), Usuario (receptor 1:N), Transacción (reverso 1:1)

### Auditoría
```javascript
{
  usuario_id, accion, entidad, descripcion,
  datos_anteriores, datos_nuevos, ip_origen
}
```
**Registro:** Trazabilidad completa de todas las operaciones  
**Relación:** Usuario (1:N) Auditoría

---

## 🔌 API REST (Backend)

### 💸 TRANSFERIR
```http
POST /api/transferencias
Authorization: Bearer {token}
Content-Type: application/json

{
  "destinatario": "2256789123",  // cuenta, teléfono o correo
  "monto": 100.00,
  "descripcion": "Pago"
}
```

**Características:**
- ✅ Comisión: 0.5% (mínimo $0.10, máximo $5.00)
- ✅ Recarga automática desde BP si saldo insuficiente
- ✅ Estados: pendiente → completada/fallida
- ✅ Reversión dentro de 24 horas
- ✅ Búsqueda por cuenta/teléfono/correo
- ✅ Auditoría completa

### 💵 RECARGA
```http
POST /api/usuarios/recargar
Authorization: Bearer {token}
Content-Type: application/json

{
  "monto": 50.00
}
```

Recarga saldo Deuna desde cuenta BP.

### 🔍 CONSULTAS AVANZADAS

#### 1. Consulta con Filtros + Paginación
```http
GET /api/transacciones/consulta?estado=completada&monto_min=50&limite=10&pagina=1
```

**Query Params:**
- `estado`: pendiente, completada, fallida, reversada
- `tipo`: pago_qr, transferencia, recarga
- `desde`, `hasta`: rango de fechas (ISO)
- `monto_min`, `monto_max`: filtro por monto
- `buscar`: búsqueda en descripción/número
- `pagina`, `limite`: paginación
- `ordenar`: fecha, monto, estado
- `orden`: asc, desc

**Response:**
```json
{
  "transacciones": [...],  // con populate de emisor/receptor
  "paginacion": {
    "pagina_actual": 1,
    "total_paginas": 3,
    "total_registros": 28
  },
  "estadisticas": {
    "completada": { "cantidad": 12, "total": "1250.50" }
  }
}
```

#### 2. Reporte Agrupado
```http
GET /api/transacciones/reporte?periodo=mes&desde=2026-01-01
```

Agrupa transacciones por día/semana/mes con totales y promedios.

#### 3. Búsqueda de Usuario (JOIN)
```http
GET /api/usuarios/buscar?cuenta=2256789123
```

Busca usuario por cuenta/teléfono/correo (equivalente a JOIN entre Usuario y Cuenta).

---

## 💻 Frontend (React)

### Página: Transferir (`/transferir`)

**Flujo de 3 pasos:**

1. **Buscar destinatario**
   - Tabs para búsqueda por cuenta/teléfono/correo
   - Validación en tiempo real
   - Muestra datos del destinatario

2. **Ingresar monto**
   - Teclado numérico personalizado
   - Botones de montos rápidos ($10, $25, $50, $100, $200)
   - Cálculo automático de comisión
   - Card de saldo disponible (Deuna + BP)
   - Campo descripción opcional

3. **Confirmar**
   - Resumen completo (destinatario, monto, comisión, total)
   - Alerta si requiere recarga automática
   - Botón confirmar/modificar

4. **Éxito**
   - Pantalla de confirmación
   - Número de transacción único
   - Indicador de recarga automática (si aplica)

### Página: Recargar (`/recargar`)

- Teclado numérico
- Montos rápidos
- Validaciones (mínimo $3, saldo BP suficiente)
- Confirmación con resumen

### Otras Páginas

- `/` - Home con saldo y acciones rápidas
- `/login`, `/register` - Autenticación
- `/billetera` - Historial de transacciones
- `/perfil` - Datos del usuario

---

## 🛠️ Tecnologías

### Backend
- **Node.js** + **Express** - API REST
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Encriptación de contraseñas
- **cors** - Cross-origin resource sharing

### Frontend
- **React 19** - UI Library
- **Vite 7** - Build tool
- **TailwindCSS 4** - Estilos
- **Zustand** - State management
- **React Router** - Navegación

### DevOps
- **Render** - Hosting (backend + frontend)
- **MongoDB Atlas** - Base de datos en la nube
- **Git** + **GitHub** - Control de versiones

---

## 📦 Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 18+
- MongoDB (local o Atlas)
- Git

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurar variables de entorno
npm run seed          # Cargar datos de prueba
npm run dev           # Iniciar servidor (puerto 3000)
```

**Variables de entorno (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/deuna
JWT_SECRET=tu_secreto_jwt
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # Iniciar Vite dev server (puerto 5173)
```

**Variables de entorno (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🌐 Deploy en Render

### Backend (Web Service)

1. Crear nuevo **Web Service** en Render
2. Conectar repositorio de GitHub
3. Configurar:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGODB_URI` - (MongoDB Atlas connection string)
     - `JWT_SECRET` - (secreto fuerte para JWT)
     - `FRONTEND_URL` - (URL del frontend en Render)

### Frontend (Static Site)

1. Crear nuevo **Static Site** en Render
2. Conectar repositorio de GitHub
3. Configurar:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variables:**
     - `VITE_API_URL` - (URL del backend en Render + `/api`)

---

## 🧪 Scripts Útiles

### Seed de Base de Datos
```bash
cd backend
npm run seed
```
Crea 12 usuarios, 20 cuentas, 12 tarjetas, 15 transacciones

### Generar Diagrama ER
```bash
cd backend
node scripts/generarDiagramaER.js
```
Genera [DIAGRAMA-ER.md](DIAGRAMA-ER.md) con modelo visual completo

### Generar Evidencias
```bash
cd backend
node scripts/generarEvidencias.js
```
Muestra estadísticas, muestras de datos, consultas avanzadas

### Casos de Prueba
```bash
cd backend
node scripts/testCases.js
```
Genera 7 casos de prueba con balances actuales

---

## 📁 Estructura del Proyecto

```
deuna/
├── backend/
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   └── db.js              # Configuración MongoDB
│   ├── models/                # Modelos Mongoose
│   │   ├── Usuario.js         # Cliente del banco
│   │   ├── Cuenta.js          # Cuentas Deuna + BP
│   │   ├── Tarjeta.js         # Tarjetas débito/crédito
│   │   ├── Transaccion.js     # Movimientos
│   │   └── Auditoria.js       # Trazabilidad
│   ├── controllers/           # Lógica de endpoints
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── transaccionController.js  # Consultas avanzadas
│   │   └── transferenciaController.js
│   ├── services/              # Lógica de negocio
│   │   ├── transferenciaService.js   # Comisiones, estados
│   │   └── pagoService.js
│   ├── routes/                # Rutas REST
│   ├── middlewares/           # Auth, error handling
│   └── scripts/               # Utilidades
│       ├── seed.js
│       ├── generarEvidencias.js
│       └── testCases.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/             # Vistas principales
│   │   │   ├── Home.jsx
│   │   │   ├── Transferir.jsx # Flujo 3 pasos
│   │   │   ├── Recargar.jsx
│   │   │   ├── Billetera.jsx  # Historial
│   │   │   └── Login.jsx
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── services/
│   │   │   └── api.js         # Cliente HTTP
│   │   └── store/
│   │       └── authStore.js   # Zustand state
│   └── vite.config.js
│
├── DEMO-EXAMEN.md             # Guía completa para demo
├── GUIA-DEMO-2MIN.md          # Script de 2 minutos
├── CHEAT-SHEET.txt            # Resumen visual
├── DEUNA-API.postman_collection.json  # Colección Postman
└── README.md                  # Este archivo
```

---

## 🎯 Funcionalidades Implementadas

### Servicios Principales
- ✅ **TRANSFERIR** - Entre usuarios por cuenta/teléfono/correo
- ✅ **RECARGA** - Desde cuenta BP a Deuna
- ✅ Comisiones automáticas (0.5%, mín $0.10, máx $5)
- ✅ Recarga automática si saldo insuficiente
- ✅ Reverso de transacciones (24 horas)
- ✅ Estados de transacción completos

### Consultas Avanzadas
- ✅ Filtros múltiples (estado, tipo, fecha, monto)
- ✅ Paginación y ordenamiento
- ✅ Búsqueda por texto (regex)
- ✅ JOIN con populate (emisor/receptor)
- ✅ Agregaciones (sum, avg, min, max)
- ✅ Reportes por período (día/semana/mes)

### Frontend
- ✅ Flujo de transferencia en 3 pasos
- ✅ Búsqueda flexible de destinatario
- ✅ Teclado numérico personalizado
- ✅ Montos rápidos
- ✅ Cálculo de comisión en tiempo real
- ✅ Validaciones completas
- ✅ Responsive design (mobile-first)
- ✅ UI moderna con TailwindCSS

### Seguridad & Auditoría
- ✅ Autenticación JWT
- ✅ Passwords hasheados con bcrypt
- ✅ Middleware de autenticación
- ✅ Registro completo de auditoría
- ✅ Estados de transacción

---

## 📚 Ejemplos de Uso (Postman)

Importar la colección: `DEUNA-API.postman_collection.json`

### 1. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "jcblaciomachuca@gmail.com",
  "password": "Julio38_"
}
```

### 2. Transferencia
```http
POST /api/transferencias
Authorization: Bearer {token}
Content-Type: application/json

{
  "destinatario": "2212345678",
  "monto": 25,
  "descripcion": "Pago demo"
}
```

### 3. Consulta Avanzada
```http
GET /api/transacciones/consulta?estado=completada&monto_min=50&limite=10
Authorization: Bearer {token}
```

---

## 🧑‍💻 Guía para Demo del Examen

Ver archivos de documentación especializados:

1. **[DEMO-EXAMEN.md](DEMO-EXAMEN.md)** - Guía completa con ejemplos y código
2. **[GUIA-DEMO-2MIN.md](GUIA-DEMO-2MIN.md)** - Script de 2 minutos para presentación
3. **[CHEAT-SHEET.txt](CHEAT-SHEET.txt)** - Resumen visual tipo "chuleta"

### Demo Rápida (2 min)

1. **Mostrar BD** (30s): `node backend/scripts/generarEvidencias.js`
2. **API REST** (45s): Postman con consulta avanzada + transferencia
3. **Frontend** (45s): Login → Transferir $25 → Confirmar → Éxito

---

## 🐛 Troubleshooting

### Backend no conecta a MongoDB
```bash
# Verificar MONGODB_URI en .env
# Si usas MongoDB local:
mongod --dbpath /ruta/a/datos
```

### Frontend no puede hacer requests al backend
```bash
# Verificar VITE_API_URL en frontend/.env
# Debe apuntar a http://localhost:3000/api (local)
# o a la URL de Render (producción)
```

### Error 401 en API
```bash
# Token expirado o inválido
# Hacer login nuevamente para obtener nuevo token
```

---

## 📝 Licencia

Este proyecto es para fines educativos (Examen ODSII).

---

## 👨‍💻 Autor

**Julio Cesar Blacio Machuca**  
Email: jcblaciomachuca@gmail.com  
GitHub: [@SrJCBM](https://github.com/SrJCBM)

---

## 📸 Screenshots

### Home
![Home](frontend/src/assets/home.png)

### Transferir - Paso 1
![Transferir paso 1](frontend/src/assets/transferir-1.png)

### Transferir - Paso 2
![Transferir paso 2](frontend/src/assets/transferir-2.png)

### Transferir - Confirmación
![Confirmación](frontend/src/assets/transferir-3.png)

---

**Estado del Proyecto:** ✅ Completo y en producción  
**Última actualización:** Febrero 2026
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
