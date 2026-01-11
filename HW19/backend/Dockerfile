# Dockerfile para Backend - Destinations API
# Optimizado para despliegue en Render.com

FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar cache de Docker)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto (Render usa el puerto de la variable PORT)
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
