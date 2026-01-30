# 🚀 Guía de Deploy - Sistema Bancario Banco Pichincha

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Preparación del Proyecto](#preparación-del-proyecto)
3. [Deploy Backend en Render](#deploy-backend-en-render)
4. [Deploy Frontend en Render](#deploy-frontend-en-render)
5. [Alternativas de Deploy Frontend](#alternativas-de-deploy-frontend)
6. [Verificación y Testing](#verificación-y-testing)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [Supabase](https://supabase.com) (base de datos ya configurada)
- Git instalado localmente
- Node.js 18+ y npm
- Python 3.14+

---

## 📦 Preparación del Proyecto

### 1. Verificar Archivos de Configuración

#### Backend

✅ Asegúrate de tener estos archivos en `backend/`:

```
backend/
├── main.py
├── requirements.txt
├── render.yaml
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── models/
│   ├── schemas/
│   └── routes/
```

**Contenido de `render.yaml`**:
```yaml
services:
  - type: web
    name: banco-pichincha-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.14.0
      - key: DATABASE_URL
        sync: false
```

#### Frontend

✅ Asegúrate de tener estos archivos en `frontend/`:

```
frontend/
├── package.json
├── vite.config.js
├── .env.production
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── ...
```

**Contenido de `.env.production`**:
```env
VITE_API_URL=https://banco-pichincha-api.onrender.com
```

---

## 🖥️ Deploy Backend en Render

### Paso 1: Preparar Repositorio

```bash
# Navega a tu proyecto
cd c:\Users\jcbla\Desktop\ODSII\sistema_bancario

# Inicializar Git (si no lo has hecho)
git init

# Crear .gitignore
echo "backend/__pycache__/" > .gitignore
echo "backend/venv/" >> .gitignore
echo "backend/.env" >> .gitignore
echo "frontend/node_modules/" >> .gitignore
echo "frontend/dist/" >> .gitignore
echo "frontend/.env.local" >> .gitignore

# Agregar todos los archivos
git add .
git commit -m "Initial commit - Sistema Depósitos Banco Pichincha"

# Crear repositorio en GitHub y pushear
git remote add origin https://github.com/TU_USUARIO/sistema-bancario.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear Web Service en Render

1. **Ve a Render Dashboard**: https://dashboard.render.com/

2. **Click en "New +"** → **"Web Service"**

3. **Conecta tu repositorio de GitHub**:
   - Autoriza Render a acceder a tus repos
   - Selecciona `sistema-bancario`

4. **Configura el servicio**:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `banco-pichincha-api` |
   | **Region** | Oregon (US West) |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
   | **Instance Type** | Free |

5. **Agregar Variables de Entorno**:
   
   Click en **"Advanced"** → **"Add Environment Variable"**:

   ```
   PYTHON_VERSION = 3.14.0
   
   DATABASE_URL = postgresql+psycopg://postgres.jvwcivzmhyxbcelkziwe:TbFk9AiP85n7A1Zo@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   ```

6. **Click en "Create Web Service"**

### Paso 3: Esperar el Deploy

- El build tomará 2-5 minutos
- Verás los logs en tiempo real
- Una vez completado, verás "Your service is live 🎉"
- Tu API estará en: `https://banco-pichincha-api.onrender.com`

### Paso 4: Verificar Backend

Prueba estos endpoints en tu navegador:

```
https://banco-pichincha-api.onrender.com/docs
https://banco-pichincha-api.onrender.com/api/depositos/estadisticas/resumen
https://banco-pichincha-api.onrender.com/api/cuentas/
```

---

## 🎨 Deploy Frontend en Render

### Paso 1: Actualizar .env.production

Actualiza `frontend/.env.production` con tu URL de backend real:

```env
VITE_API_URL=https://banco-pichincha-api.onrender.com
```

```bash
cd frontend
# Commiteamos el cambio
git add .env.production
git commit -m "Update production API URL"
git push
```

### Paso 2: Crear Static Site en Render

1. **Ve a Render Dashboard** → **"New +"** → **"Static Site"**

2. **Conecta el mismo repositorio**: `sistema-bancario`

3. **Configura el sitio**:

   | Campo | Valor |
   |-------|-------|
   | **Name** | `banco-pichincha-web` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. **Variables de Entorno**:
   ```
   VITE_API_URL = https://banco-pichincha-api.onrender.com
   ```

5. **Click en "Create Static Site"**

### Paso 3: Verificar Frontend

- Tu app estará en: `https://banco-pichincha-web.onrender.com`
- Prueba crear un depósito
- Verifica que las notificaciones funcionen
- Revisa el Dashboard con estadísticas

---

## 🌐 Alternativas de Deploy Frontend

### Opción A: Vercel (Recomendado para React)

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

3. **Configurar variables de entorno en Vercel Dashboard**:
   - Ve a tu proyecto → Settings → Environment Variables
   - Agrega `VITE_API_URL` con tu URL de backend

**URL**: `https://banco-pichincha.vercel.app`

---

### Opción B: Netlify

1. **Instalar Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Deploy**:
```bash
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

3. **Configurar en netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**URL**: `https://banco-pichincha.netlify.app`

---

## ✅ Verificación y Testing

### Test 1: Validar Cuenta

```bash
curl https://banco-pichincha-api.onrender.com/api/cuentas/validar/2200001001
```

**Resultado esperado**:
```json
{
  "titular_nombre": "Juan Pérez",
  "titular_cedula": "******5678",
  ...
}
```

### Test 2: Obtener Estadísticas

```bash
curl https://banco-pichincha-api.onrender.com/api/depositos/estadisticas/resumen
```

**Resultado esperado**:
```json
{
  "total_depositos": 30,
  "monto_total": 124650.00,
  ...
}
```

### Test 3: Crear Depósito desde Frontend

1. Abre `https://banco-pichincha-web.onrender.com`
2. Click en "Nuevo Depósito"
3. Ingresa número de cuenta: `2200001001`
4. Click en "Validar cuenta"
5. Debería aparecer: "✅ Cuenta válida. Titular: Juan Pérez"
6. Completa el formulario y crea el depósito
7. Debería aparecer notificación de éxito

---

## 🔧 Troubleshooting

### Problema 1: Backend no inicia - Error de Puerto

**Error**: `Address already in use`

**Solución**: Render usa variable `$PORT` automáticamente. Verifica que tu `main.py` no fije el puerto:

```python
# ❌ INCORRECTO
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)

# ✅ CORRECTO (Render inyecta el puerto)
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
```

---

### Problema 2: Error de Conexión a Base de Datos

**Error**: `Connection refused` o `timeout`

**Solución**:
1. Verifica que `DATABASE_URL` esté configurada en Render
2. Usa **Session Pooler** de Supabase (puerto 6543, no 5432)
3. Verifica que la URL tenga el formato correcto:
```
postgresql+psycopg://USER:PASS@HOST:6543/postgres
```

---

### Problema 3: Frontend no se conecta al Backend

**Error**: `Network Error` o `CORS`

**Solución**:

1. **Verificar CORS en backend** (`main.py`):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

2. **Verificar .env.production**:
```env
VITE_API_URL=https://banco-pichincha-api.onrender.com
```

3. **Rebuild frontend** después de cambiar `.env.production`

---

### Problema 4: Build de Frontend Falla

**Error**: `Module not found` o `npm install failed`

**Solución**:

1. Verifica que `package.json` tenga todas las dependencias:
```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0",
    "axios": "^1.13.4"
  }
}
```

2. Limpia caché y reinstala:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Problema 5: Backend se "duerme" (Free Tier)

**Síntoma**: Primera request tarda 30-60 segundos

**Explicación**: Render Free Tier duerme servicios inactivos después de 15 minutos.

**Soluciones**:
1. **Cron Job** (ping cada 10 minutos):
   - Crear cuenta en [cron-job.org](https://cron-job.org)
   - Agregar job: `https://banco-pichincha-api.onrender.com/docs` cada 10 min

2. **Upgrade a Paid Plan** ($7/mes para mantenerlo siempre activo)

---

### Problema 6: Variables de Entorno no se Cargan

**Solución**:

1. En **Render Dashboard** → Tu servicio → **Environment**
2. Verifica que cada variable tenga el valor correcto
3. Click en **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## 📊 Monitoreo en Producción

### Logs del Backend (Render)

1. Ve a tu servicio en Render
2. Click en **"Logs"** (tab superior)
3. Verás requests en tiempo real:
```
INFO: 200 POST /api/depositos/
INFO: 404 GET /api/cuentas/validar/9999999
```

### Métricas

Render Free Tier incluye:
- CPU usage
- Memory usage
- Request count
- Response times

---

## 🔐 Seguridad en Producción

### Checklist de Seguridad

- [ ] Cambiar `allow_origins=["*"]` a tu dominio específico
- [ ] Implementar rate limiting (slowapi)
- [ ] Agregar autenticación JWT
- [ ] Usar HTTPS (Render lo hace automático)
- [ ] Rotar credenciales de base de datos
- [ ] Agregar validación de input más estricta
- [ ] Implementar logging de auditoría
- [ ] Configurar alertas de errores (Sentry)

---

## 📈 Próximos Pasos

Una vez deployado:

1. ✅ Configurar dominio personalizado (opcional)
2. ✅ Implementar CI/CD (GitHub Actions)
3. ✅ Agregar tests automatizados
4. ✅ Configurar monitoring (New Relic, Datadog)
5. ✅ Implementar backup automático de BD
6. ✅ Documentar procedimientos de rollback

---

## 🆘 Soporte

**Si algo no funciona**:

1. Revisa los logs en Render
2. Verifica las variables de entorno
3. Prueba los endpoints directamente con cURL
4. Revisa la documentación de Swagger: `/docs`

**Contacto**: grupo2@bancopichincha.com

---

## 🎉 Deploy Exitoso

Si llegaste aquí y todo funciona:

✅ Backend corriendo en Render  
✅ Frontend deployado y conectado  
✅ Base de datos en Supabase operativa  
✅ Notificaciones funcionando  
✅ Estadísticas mostrando datos reales  

**¡Felicitaciones! Tu sistema está en producción 🚀**

---

**Grupo 2 - Depósitos | Banco Pichincha | 2026**
