# 🚀 Script de Inicio Rápido - Sistema Depósitos Banco Pichincha
# Grupo 2 - ODSII

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🏦 Banco Pichincha - Setup Inicial" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Backend Setup
Write-Host "📦 Instalando dependencias del Backend..." -ForegroundColor Blue
Set-Location backend

# Crear entorno virtual
if (-not (Test-Path "venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Instalar dependencias
Write-Host "Instalando paquetes Python..." -ForegroundColor Yellow
pip install -r requirements.txt

# Verificar .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  No se encontró archivo .env" -ForegroundColor Yellow
    Write-Host "Por favor crea el archivo .env con:"
    Write-Host "DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:6543/postgres"
    Write-Host ""
}

Set-Location ..

Write-Host ""
Write-Host "📦 Instalando dependencias del Frontend..." -ForegroundColor Blue
Set-Location frontend

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Node.js no está instalado" -ForegroundColor Yellow
    Write-Host "Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
}

# Instalar dependencias
Write-Host "Instalando paquetes npm..." -ForegroundColor Yellow
npm install

# Verificar .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "Creando .env.local..." -ForegroundColor Yellow
    "VITE_API_URL=http://localhost:8000" | Out-File -FilePath ".env.local" -Encoding UTF8
}

Set-Location ..

Write-Host ""
Write-Host "✅ Setup completado!" -ForegroundColor Green
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🚀 Para iniciar el proyecto:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Backend (Terminal 1):" -ForegroundColor White
Write-Host "   cd backend"
Write-Host "   .\venv\Scripts\Activate.ps1"
Write-Host "   uvicorn main:app --reload"
Write-Host ""
Write-Host "2️⃣  Frontend (Terminal 2):" -ForegroundColor White
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000"
Write-Host "Swagger:  http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:3000"
Write-Host "==================================" -ForegroundColor Cyan
