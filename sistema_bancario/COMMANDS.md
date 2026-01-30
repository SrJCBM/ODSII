# 📋 Comandos Útiles - Cheat Sheet

Comandos copy-paste para trabajar con el proyecto.

## 🚀 Inicio Rápido

### Windows (PowerShell)

```powershell
# Setup inicial
.\setup.ps1

# Backend (Terminal 1)
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Linux/Mac (Bash)

```bash
# Setup inicial
chmod +x setup.sh
./setup.sh

# Backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## 📦 Instalación Manual

### Backend

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing API con cURL

### Validar Cuenta

```bash
curl http://localhost:8000/api/cuentas/validar/2200001001
```

### Crear Depósito

```bash
curl -X POST http://localhost:8000/api/depositos/ \
  -H "Content-Type: application/json" \
  -d '{
    "id_cuenta": 1,
    "monto": 100.00,
    "canal_deposito": "VENTANILLA",
    "tipo_deposito": "EFECTIVO",
    "observaciones": "Depósito de prueba"
  }'
```

### Ver Estadísticas

```bash
curl http://localhost:8000/api/depositos/estadisticas/resumen
```

### Listar Depósitos

```bash
# Todos
curl http://localhost:8000/api/depositos/

# Filtrar por estado
curl "http://localhost:8000/api/depositos/?estado=PENDIENTE"

# Filtrar por canal
curl "http://localhost:8000/api/depositos/?canal_deposito=VENTANILLA"

# Con límite
curl "http://localhost:8000/api/depositos/?limit=10"
```

### Actualizar Estado

```bash
curl -X PUT http://localhost:8000/api/depositos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "PROCESADO",
    "observaciones": "Depósito verificado"
  }'
```

### Eliminar Depósito

```bash
curl -X DELETE http://localhost:8000/api/depositos/1
```

## 🔧 Git Commands

### Primera vez

```bash
git init
git add .
git commit -m "Initial commit - Sistema Depósitos Banco Pichincha"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sistema-bancario.git
git push -u origin main
```

### Updates

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

### Ver cambios

```bash
git status
git diff
git log --oneline
```

## 🗄️ Base de Datos

### Conectar a Supabase (psql)

```bash
psql "postgresql://postgres.jvwcivzmhyxbcelkziwe:TbFk9AiP85n7A1Zo@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
```

### Consultas SQL útiles

```sql
-- Ver todos los depósitos
SELECT * FROM depositos ORDER BY fecha_deposito DESC LIMIT 10;

-- Estadísticas
SELECT 
    COUNT(*) as total,
    SUM(monto) as monto_total,
    AVG(monto) as promedio
FROM depositos;

-- Por canal
SELECT 
    canal_deposito,
    COUNT(*) as cantidad,
    SUM(monto) as monto
FROM depositos
GROUP BY canal_deposito;

-- Por estado
SELECT 
    estado,
    COUNT(*) as cantidad
FROM depositos
GROUP BY estado;
```

## 🏗️ Build para Producción

### Frontend

```bash
cd frontend
npm run build
# Output en: frontend/dist/
```

### Backend (verificar)

```bash
cd backend
python -m py_compile main.py
# Sin errores = listo para deploy
```

## 🔍 Troubleshooting

### Ver logs del backend

```bash
cd backend
uvicorn main:app --reload --log-level debug
```

### Limpiar caché frontend

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Reinstalar backend

```bash
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # o venv\Scripts\activate en Windows
pip install -r requirements.txt
```

### Ver puertos ocupados

```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :8000
lsof -i :3000
```

### Matar proceso en puerto

```bash
# Windows (como admin)
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

## 📊 Monitoreo

### Ver requests en tiempo real

```bash
# Backend con logs detallados
uvicorn main:app --reload --log-level info
```

### Ver tamaño del proyecto

```bash
# Windows
du -sh .

# Linux/Mac
du -sh .
du -sh backend frontend
```

## 🚀 Deploy en Render

### Update código en producción

```bash
# Hacer cambios
git add .
git commit -m "Update: descripción"
git push

# Render auto-deploys en push a main
```

### Ver logs en Render

```bash
# Instalar Render CLI
npm install -g render-cli

# Login
render login

# Ver logs
render logs banco-pichincha-api
```

## 🧹 Limpieza

### Limpiar archivos temporales

```bash
# Windows PowerShell
Get-ChildItem -Path . -Include __pycache__,*.pyc,node_modules -Recurse | Remove-Item -Recurse -Force

# Linux/Mac
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete
find . -type d -name "node_modules" -exec rm -r {} +
```

## 📝 Variables de Entorno

### Backend (.env)

```env
DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:6543/postgres
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000
```

### Frontend (.env.production)

```env
VITE_API_URL=https://banco-pichincha-api.onrender.com
```

## 🌐 URLs Importantes

| Entorno | Frontend | Backend | Swagger |
|---------|----------|---------|---------|
| Local | http://localhost:3000 | http://localhost:8000 | http://localhost:8000/docs |
| Producción | https://banco-pichincha-web.onrender.com | https://banco-pichincha-api.onrender.com | https://banco-pichincha-api.onrender.com/docs |

---

**Grupo 2 - Depósitos | Banco Pichincha**
