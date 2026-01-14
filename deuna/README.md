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
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     - `MONGODB_URI` - String de conexión a MongoDB
     - `JWT_SECRET` - Secreto para tokens JWT
     - `NODE_ENV` - `production`

### Frontend (Static Site)
1. Crear nuevo Static Site
2. Conectar repositorio
3. Configurar:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL` - URL del backend (ej: https://deuna-api.onrender.com/api)

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
