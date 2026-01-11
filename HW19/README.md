# 🌍 Destinations - CRUD de Destinos Turísticos

Aplicación web completa para gestionar destinos turísticos, compuesta por una API REST (Backend) y una interfaz web (Frontend).

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Conceptos UI/UX Aplicados](#conceptos-uiux-aplicados)
- [Requisitos](#requisitos)
- [Instalación Local](#instalación-local)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue en Render](#despliegue-en-render)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│    Frontend     │ ──────► │    Backend      │ ──────► │  MongoDB Atlas  │
│  React + Vite   │  HTTP   │  Express.js     │         │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
     Render.com                  Render.com                  Cloud
```

---

## 📚 Conceptos UI/UX Aplicados

### 2.07.00 - Foundations of User Interface Design

| Concepto | Implementación |
|----------|----------------|
| **3rd Law (Humane Interface)** | Confirmación antes de eliminar, validación de formularios, mensajes de error descriptivos |
| **4th Law (User Sets the Pace)** | El usuario decide cuándo crear/editar/eliminar, sin acciones automáticas sobre datos |
| **User-Centered Design** | Interfaz diseñada para gestionar destinos de forma rápida e intuitiva |

### 2.07.01 - Cognetics and Locus of Attention

| Concepto | Implementación |
|----------|----------------|
| **Single Focus** | Modales que enfocan la atención en una tarea específica |
| **Concentration Principle** | Overlay oscuro reduce distracciones, interfaz limpia |

### 2.07.02 - Information Organization

| Concepto | Implementación |
|----------|----------------|
| **Visual Hierarchy** | Header prominente → Filtros → Grid de contenido |
| **Card Pattern (Tidwell)** | Cada destino en tarjeta con imagen, título, país, acciones |

### 2.07.06 - Navigation (Wayfinding)

| Concepto | Implementación |
|----------|----------------|
| **Wayfinding** | Filtro por país indica cómo navegar los datos |
| **Progress Indicator** | Spinner durante carga de datos |

### 2.07.09 - Actions and Commands

| Concepto | Implementación |
|----------|----------------|
| **Clear Triggers** | Botón "Nuevo Destino" prominente, acciones claras en tarjetas |
| **Command Feedback** | Alertas de éxito/error después de cada operación |

### 2.07.11 - Getting Input From The User

| Concepto | Implementación |
|----------|----------------|
| **Minimizing Cognitive Load** | Dropdown de países auto-poblado, campos agrupados lógicamente |
| **Smart Defaults** | Placeholders como guía en formularios |

---

## 📦 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta en MongoDB Atlas (ya configurada)
- Cuenta en Render.com (para despliegue)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd HW19
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm run dev
```

### 3. Configurar Frontend

```bash
cd frontend
npm install

# Crear archivo .env
cp .env.example .env
# Editar .env si es necesario

# Iniciar en modo desarrollo
npm run dev
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/destinations

---

## 🔐 Variables de Entorno

### Backend (`.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `5000` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb+srv://...` |
| `CORS_ORIGIN` | Orígenes permitidos (separados por coma) | `http://localhost:5173` |

### Frontend (`.env`)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API | `http://localhost:5000/api` |

---

## ☁️ Despliegue en Render

### Paso 1: Crear repositorio en GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repo-github>
git push -u origin main
```

### Paso 2: Desplegar Backend en Render

1. Ir a [render.com](https://render.com) y crear cuenta
2. Click en **New** → **Web Service**
3. Conectar con tu repositorio de GitHub
4. Configurar:
   - **Name**: `destinations-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Agregar variables de entorno:
   - `MONGODB_URI` = tu conexión a MongoDB Atlas
   - `CORS_ORIGIN` = URL del frontend (la obtendrás después)
6. Click en **Create Web Service**
7. Anotar la URL del backend (ej: `https://destinations-api.onrender.com`)

### Paso 3: Desplegar Frontend en Render

1. En Render, click en **New** → **Static Site**
2. Conectar con el mismo repositorio
3. Configurar:
   - **Name**: `destinations-app`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Agregar variable de entorno:
   - `VITE_API_URL` = URL del backend + `/api` (ej: `https://destinations-api.onrender.com/api`)
5. Click en **Create Static Site**

### Paso 4: Actualizar CORS del Backend

1. Ir al servicio del backend en Render
2. En **Environment**, actualizar `CORS_ORIGIN` con la URL del frontend
3. El servicio se re-desplegará automáticamente

---

## 📡 API Endpoints

### CRUD Básico

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/destinations` | Obtener todos los destinos |
| `GET` | `/api/destinations/:id` | Obtener un destino por ID |
| `POST` | `/api/destinations` | Crear nuevo destino |
| `PUT` | `/api/destinations/:id` | Actualizar destino |
| `DELETE` | `/api/destinations/:id` | Eliminar destino |

### 🎯 Business Rule A: Búsqueda por País

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/destinations/country/:country` | Destinos por país |
| `GET` | `/api/destinations/countries` | Lista de países únicos |

### Ejemplo de Peticiones

```bash
# Obtener todos los destinos
curl http://localhost:5000/api/destinations

# Obtener destinos de Ecuador
curl http://localhost:5000/api/destinations/country/Ecuador

# Crear nuevo destino
curl -X POST http://localhost:5000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{"name": "Machu Picchu", "country": "Perú", "description": "Ciudadela inca"}'
```

---

## 📁 Estructura del Proyecto

```
HW19/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # Conexión MongoDB
│   │   ├── controllers/
│   │   │   └── destinationController.js  # Lógica CRUD
│   │   ├── models/
│   │   │   └── Destination.js    # Modelo Mongoose
│   │   ├── routes/
│   │   │   └── destinationRoutes.js  # Rutas Express
│   │   └── index.js              # Punto de entrada
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alert.jsx         # Mensajes feedback
│   │   │   ├── ConfirmDialog.jsx # Confirmación eliminar
│   │   │   ├── DestinationCard.jsx   # Tarjeta destino
│   │   │   ├── DestinationDetail.jsx # Modal detalles
│   │   │   └── DestinationForm.jsx   # Formulario CRUD
│   │   ├── services/
│   │   │   └── api.js            # Cliente API
│   │   ├── App.jsx               # Componente principal
│   │   ├── index.css             # Estilos globales
│   │   └── main.jsx              # Punto de entrada React
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ✅ Entregables Completados

- [x] ✅ Código fuente del **Backend** con API REST funcional
- [x] ✅ Código fuente del **Frontend** con interfaz de usuario
- [x] ✅ **Dockerfiles** para ambos servicios
- [x] ✅ Archivo **README.md** con instrucciones
- [x] ✅ Variables de entorno documentadas (**.env.example**)
- [x] ✅ **Business Rule A** implementada (Búsqueda por país)

---

## 👤 Autor

Desarrollado como proyecto de la asignatura ODSII - HW19

---

## 📄 Licencia

ISC
