#!/bin/bash

# 🚀 Script de Inicio Rápido - Sistema Depósitos Banco Pichincha
# Grupo 2 - ODSII

echo "=================================="
echo "🏦 Banco Pichincha - Setup Inicial"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Instalando dependencias del Backend...${NC}"
cd backend

# Crear entorno virtual
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creando entorno virtual...${NC}"
    python -m venv venv
fi

# Activar entorno virtual
echo -e "${YELLOW}Activando entorno virtual...${NC}"
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # Linux/Mac
    source venv/bin/activate
fi

# Instalar dependencias
echo -e "${YELLOW}Instalando paquetes Python...${NC}"
pip install -r requirements.txt

# Verificar .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  No se encontró archivo .env${NC}"
    echo "Por favor crea el archivo .env con:"
    echo "DATABASE_URL=postgresql+psycopg://USER:PASS@HOST:6543/postgres"
    echo ""
fi

cd ..

echo ""
echo -e "${BLUE}📦 Instalando dependencias del Frontend...${NC}"
cd frontend

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js no está instalado${NC}"
    echo "Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

# Instalar dependencias
echo -e "${YELLOW}Instalando paquetes npm...${NC}"
npm install

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creando .env.local...${NC}"
    echo "VITE_API_URL=http://localhost:8000" > .env.local
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup completado!${NC}"
echo ""
echo "=================================="
echo "🚀 Para iniciar el proyecto:"
echo "=================================="
echo ""
echo "1️⃣  Backend (Terminal 1):"
echo "   cd backend"
echo "   venv\\Scripts\\activate    # Windows"
echo "   source venv/bin/activate  # Linux/Mac"
echo "   uvicorn main:app --reload"
echo ""
echo "2️⃣  Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "=================================="
echo "🌐 URLs:"
echo "=================================="
echo "Backend:  http://localhost:8000"
echo "Swagger:  http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo "=================================="
