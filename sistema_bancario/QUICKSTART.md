# ⚡ Inicio Rápido - 5 Minutos

Guía express para ejecutar el proyecto localmente en menos de 5 minutos.

## 📋 Pre-requisitos

✅ Python 3.14+  
✅ Node.js 18+  
✅ Git

## 🚀 Opción 1: Script Automático (Recomendado)

### Windows (PowerShell)

```powershell
# Ejecutar como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

### Linux/Mac (Bash)

```bash
chmod +x setup.sh
./setup.sh
```

## 🔧 Opción 2: Manual

### Paso 1: Backend (2 minutos)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar
pip install -r requirements.txt

# Crear .env (con tus credenciales)
echo DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:6543/postgres > .env

# Iniciar
uvicorn main:app --reload
```

✅ Backend corriendo en http://localhost:8000

### Paso 2: Frontend (2 minutos)

```bash
cd frontend

# Instalar
npm install

# Crear .env.local
echo VITE_API_URL=http://localhost:8000 > .env.local

# Iniciar
npm run dev
```

✅ Frontend corriendo en http://localhost:3000

## 🎯 Prueba Rápida

### 1. Abre el frontend
```
http://localhost:3000
```

### 2. Ve a "Nuevo Depósito"

### 3. Valida una cuenta
```
Número de cuenta: 2200001001
```

### 4. Completa el formulario
```
Monto: $100
Canal: Ventanilla
Tipo: Efectivo
```

### 5. ¡Listo! 🎉

Deberías ver una notificación de éxito.

## 📚 URLs Importantes

| Recurso | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

## ❓ Problemas Comunes

### Backend no inicia

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Solución**:
```bash
# Verifica que el venv esté activado
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Reinstala
pip install -r requirements.txt
```

### Frontend no conecta al Backend

**Error**: `Network Error` en consola

**Solución**:
1. Verifica que el backend esté corriendo en http://localhost:8000
2. Revisa que `.env.local` tenga: `VITE_API_URL=http://localhost:8000`
3. Reinicia el servidor de Vite: `Ctrl+C` y `npm run dev`

### Base de datos no conecta

**Error**: `Connection refused`

**Solución**:
1. Verifica las credenciales de Supabase en `.env`
2. Usa **Session Pooler** (puerto 6543), no Direct Connection
3. Formato correcto: `postgresql+psycopg://USER:PASS@HOST:6543/postgres`

## 🚀 Siguiente Paso

Una vez funcionando localmente, consulta:

- **[README.md](README.md)**: Documentación completa del proyecto
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Todos los endpoints
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Deploy en Render

---

**¿Problemas? Revisa los logs del backend y frontend para más detalles.**

**Grupo 2 - Depósitos | Banco Pichincha**
