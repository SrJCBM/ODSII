# Dockerfile para Frontend - React + Vite
# Optimizado para despliegue en Render.com

# ═══════════════════════════════════════════════════════════
# ETAPA 1: Build
# ═══════════════════════════════════════════════════════════
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumento para la URL del API (se pasa en build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Construir la aplicación
RUN npm run build

# ═══════════════════════════════════════════════════════════
# ETAPA 2: Servidor de producción
# ═══════════════════════════════════════════════════════════
FROM node:18-alpine

WORKDIR /app

# Instalar serve para servir archivos estáticos
RUN npm install -g serve

# Copiar archivos construidos
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para servir la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
