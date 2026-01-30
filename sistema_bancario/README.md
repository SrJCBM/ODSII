# 🏦 Sistema de Depósitos - Banco Pichincha

![Python](https://img.shields.io/badge/Python-3.14-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-orange)

Sistema integral de gestión de depósitos bancarios desarrollado para Banco Pichincha con arquitectura REST, frontend moderno en React y backend robusto en FastAPI.

**Grupo 2: Depósitos**

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Documentación](#documentación)
- [Deploy en Render](#deploy-en-render)

## ✨ Características

### Funcionalidades Principales
- ✅ **Validación de Cuentas**: Verifica titular antes de depositar (nombre completo, cédula/correo enmascarados)
- ✅ **Múltiples Canales**: Ventanilla, Cajero Automático, App Móvil, Banca Web, Corresponsal
- ✅ **Reglas de Negocio**: Límites diarios por canal, montos mínimos por tipo de depósito
- ✅ **Dashboard Estadístico**: Visualización de totales ($124,650), promedios, distribución
- ✅ **Gestión de Estados**: Pendiente → Procesado/Rechazado con auditoría completa
- ✅ **Notificaciones Elegantes**: Sistema toast con 4 tipos (SUCCESS, ERROR, WARNING, INFO)
- ✅ **Filtros Avanzados**: Por fecha, canal, estado, cuenta, cajero
- ✅ **Responsive Design**: Optimizado para desktop y móvil con TailwindCSS 4

### Seguridad
- 🔒 Enmascaramiento de datos sensibles (cédula, correo)
- 🔒 Validación de estado antes de modificaciones
- 🔒 Registro de IP de origen y usuario
- 🔒 Auditoría completa de operaciones

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.36
- **Base de Datos**: PostgreSQL (Supabase Session Pooler IPv4)
- **Driver**: psycopg 3.1.18 [binary]
- **Validación**: Pydantic 2.x
- **CORS**: Configurado para producción

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM 7.13.0
- **HTTP Client**: Axios 1.13.4
- **Estilos**: TailwindCSS 4.x
- **Iconos**: Lucide React

### Infraestructura
- **Backend Deploy**: Render (Python 3.14)
- **Frontend Deploy**: Render Static Site / Vercel / Netlify
- **Base de Datos**: Supabase PostgreSQL

## 📁 Estructura del Proyecto

```
sistema_bancario/
├── backend/                    # API REST con FastAPI
│   ├── app/
│   │   ├── models/            # Modelos SQLAlchemy
│   │   │   ├── deposito.py
│   │   │   ├── cuenta.py
│   │   │   ├── cajero.py
│   │   │   └── __init__.py
│   │   ├── routes/            # Endpoints REST
│   │   │   ├── depositos.py   # CRUD depósitos + estadísticas
│   │   │   ├── cuentas.py     # Validación de cuentas
│   │   │   ├── cajeros.py     # Lista cajeros activos
│   │   │   └── __init__.py
│   │   ├── schemas/           # Schemas Pydantic
│   │   │   ├── deposito.py
│   │   │   ├── cuenta.py
│   │   │   └── __init__.py
│   │   └── database.py        # Conexión PostgreSQL
│   ├── main.py                # Entry point FastAPI
│   ├── requirements.txt       # Dependencies
│   ├── render.yaml            # Render config
│   └── .env
│
├── frontend/                   # SPA con React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificacionContext.js
│   │   │   ├── NotificacionProvider.jsx
│   │   │   └── useNotificacion.js
│   │   ├── pages/             # Páginas principales
│   │   │   ├── Dashboard.jsx      # Estadísticas
│   │   │   ├── ListaDepositos.jsx # Lista + filtros
│   │   │   └── NuevoDeposito.jsx  # Formulario creación
│   │   ├── App.jsx            # Router principal
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind + animations
│   ├── public/
│   │   └── Logo Banco.jpg     # Logo corporativo
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.local
│   └── .env.production
│
├── API_DOCUMENTATION.md        # Documentación completa API
├── DEPLOYMENT.md               # Guía deploy Render
├── ANALISIS_MODELO.md          # Análisis modelo de datos
├── BancoPichincha_Postgres.sql # Schema PostgreSQL
└── README.md                   # Este archivo
```

## 🔧 Instalación y Configuración

### Prerrequisitos

- Python 3.14+
- Node.js 18+
- npm o yarn
- Git

### 1. Clonar Repositorio

```bash
git clone https://github.com/TU_USUARIO/sistema-bancario.git
cd sistema-bancario
```

### 2. Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
echo DATABASE_URL=postgresql+psycopg://postgres.jvwcivzmhyxbcelkziwe:TbFk9AiP85n7A1Zo@aws-1-us-east-1.pooler.supabase.com:6543/postgres > .env

# Iniciar servidor
uvicorn main:app --reload
```

**Backend corriendo en**: `http://localhost:8000`  
**Swagger UI**: `http://localhost:8000/docs`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env.local
echo VITE_API_URL=http://localhost:8000 > .env.local

# Iniciar servidor de desarrollo
npm run dev
```


## 🎮 Uso Rápido

### Ejecutar Backend

```bash
cd backend

# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Ejecutar servidor
uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

### Ejecutar Frontend

```bash
cd frontend

# Iniciar desarrollo
npm run dev
```

El frontend estará en: `http://localhost:3000`

### Documentación API Interactiva

Una vez ejecutando el backend:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Depósitos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/depositos/` | Listar depósitos con filtros |
| GET | `/api/depositos/{id}` | Obtener depósito específico |
| POST | `/api/depositos/` | Crear nuevo depósito |
| PUT | `/api/depositos/{id}` | Actualizar estado |
| DELETE | `/api/depositos/{id}` | Eliminar depósito pendiente |
| GET | `/api/depositos/estadisticas/resumen` | Estadísticas completas |

### Cuentas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cuentas/` | Listar cuentas activas |
| GET | `/api/cuentas/{id}` | Obtener cuenta específica |
| GET | `/api/cuentas/validar/{numero}` | Validar cuenta para depósito |

### Cajeros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/cajeros/` | Listar cajeros activos |

### Ejemplo - Crear Depósito

```bash
# 1. Validar cuenta
curl http://localhost:8000/api/cuentas/validar/2200001001

# 2. Crear depósito
curl -X POST "http://localhost:8000/api/depositos/" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cuenta": 1,
    "monto": 500.00,
    "canal_deposito": "VENTANILLA",
    "tipo_deposito": "EFECTIVO",
    "observaciones": "Depósito mensual"
  }'
```

## 📚 Documentación Completa

Para información detallada, consulta:

- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Documentación completa de todos los endpoints con ejemplos en cURL, Python y JavaScript
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Guía paso a paso para deployar en Render, Vercel y otras plataformas
- **[ANALISIS_MODELO.md](ANALISIS_MODELO.md)**: Análisis completo del modelo de datos

## 📊 Reglas de Negocio

### Límites Diarios por Canal

| Canal | Límite Diario |
|-------|--------------|
| Cajero Automático | $5,000 |
| App Móvil | $10,000 |
| Banca Web | $20,000 |
| Ventanilla | $50,000 |
| Corresponsal | $3,000 |

### Montos Mínimos por Tipo

| Tipo | Monto Mínimo |
|------|-------------|
| Efectivo | $1.00 |
| Cheque | $10.00 |
| Transferencia | $0.01 |

### Estados de Depósito

- **PENDIENTE**: Recién creado, esperando procesamiento
- **PROCESADO**: Verificado y acreditado a la cuenta
- **RECHAZADO**: Rechazado por validación

## 🚀 Deploy en Render

### Paso 1: Backend

1. Push tu código a GitHub
2. Conecta tu repo en [Render](https://render.com)
3. Configura:
   - **Build**: `pip install -r requirements.txt`
   - **Start**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Env Vars**: Agrega `DATABASE_URL`
4. Deploy!

Tu API estará en: `https://banco-pichincha-api.onrender.com`

### Paso 2: Frontend

1. Actualiza `.env.production` con URL del backend
2. En Render:
   - **Build**: `npm install && npm run build`
   - **Publish**: `dist`
3. Deploy!

Tu app estará en: `https://banco-pichincha-web.onrender.com`

**Para guía completa**: Ver [DEPLOYMENT.md](DEPLOYMENT.md)

## 🧪 Testing

### Backend

```bash
cd backend
pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm run test
```

## 📊 Modelo de Datos Principales

### Tabla DEPOSITOS

Campos clave:
- `id_deposito` (SERIAL PK)
- `id_cuenta_destino` (FK → CUENTA)
- `id_cajero` (FK → CAJERO_AUTOMATICO)
- `id_persona_deposita` (FK → PERSONA)
- `monto` (NUMERIC(12,2))
- `canal_deposito` (ENUM)
- `tipo_deposito` (ENUM)
- `estado` (ENUM: PENDIENTE, PROCESADO, RECHAZADO)
- `fecha_deposito` (TIMESTAMP)
- `numero_comprobante` (VARCHAR UNIQUE)

Ver schema completo en [BancoPichincha_Postgres.sql](BancoPichincha_Postgres.sql)

## 🤝 Contribución

Este proyecto fue desarrollado por **Grupo 2 - Depósitos** para el curso ODSII.

## 📞 Contacto

- **Grupo**: 2 - Depósitos
- **Curso**: ODSII
- **Año**: 2026

## 🎉 Agradecimientos

- Profesor del curso ODSII
- Banco Pichincha por el caso de estudio
- Comunidad de FastAPI y React

## 📅 Changelog

### v1.0.0 (Enero 2026)
- ✨ Implementación inicial completa
- 🎨 Diseño UI con TailwindCSS 4
- 🔒 Validación de cuentas con enmascaramiento
- 📊 Dashboard con estadísticas ($124,650 total)
- 🔔 Sistema de notificaciones toast
- 📱 Diseño 100% responsive
- 🚀 Deploy en Render configurado
- 📘 Documentación completa de API
- 🧹 Clean Code + 0 linter errors

## 🔮 Roadmap Futuro

- [ ] Autenticación JWT
- [ ] Exportar a PDF/Excel
- [ ] Gráficos interactivos (Chart.js)
- [ ] Notificaciones por email
- [ ] Tests unitarios completos
- [ ] CI/CD con GitHub Actions

---

**Desarrollado con ❤️ por Grupo 2 - Depósitos**

**Banco Pichincha | 2026**
- `id_cajero` - FK a CAJERO (opcional)
- `id_persona_deposita` - FK a PERSONA
- `monto`, `moneda`, `canal_deposito`, `tipo_deposito`
- `fecha_deposito`, `fecha_procesamiento`
- `estado` - PENDIENTE, PROCESADO, RECHAZADO
- `referencia`, `numero_comprobante`
- `banco_origen`, `numero_cheque`
- `observaciones`, `usuario_registro`, `ip_origen`

## 🧪 Testing

```bash
# Probar endpoints
curl http://localhost:8000/health

# Ver estadísticas
curl http://localhost:8000/api/depositos/estadisticas/resumen

# Listar depósitos
curl http://localhost:8000/api/depositos
```

## 👥 Equipo

**Grupo 2 - Depósitos**
- Sistema Bancario Banco Pichincha
- Desarrollo Orientado de Software II

## 📝 Próximos Pasos

1. ✅ Backend FastAPI completo
2. ⬜ Frontend React
3. ⬜ Autenticación JWT
4. ⬜ Tests unitarios
5. ⬜ CI/CD con GitHub Actions
6. ⬜ Integración con otros módulos

## 📄 Licencia

Proyecto académico - ODSII 2026

---

**¿Necesitas ayuda?** Revisa la documentación en `/docs` o contacta al equipo.
