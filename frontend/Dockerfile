# Etapa de construcción
FROM node:16-alpine as build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install && \
    npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:16-alpine
WORKDIR /app

# Instalar serve para servir la aplicación
RUN npm install -g serve

# Crear directorios necesarios
RUN mkdir -p /app/build /scripts

# Copiar los archivos construidos
COPY --from=build /app/build ./build

# Crear el script de inicio
RUN echo '#!/bin/sh' > /scripts/start.sh && \
    echo 'mkdir -p /app/build' >> /scripts/start.sh && \
    echo 'if [ ! -d "/app/build" ]; then' >> /scripts/start.sh && \
    echo '  echo "Error: /app/build directory not found"' >> /scripts/start.sh && \
    echo '  exit 1' >> /scripts/start.sh && \
    echo 'fi' >> /scripts/start.sh && \
    echo 'cat > /app/build/env-config.js << EOF' >> /scripts/start.sh && \
    echo 'window.ENV = {' >> /scripts/start.sh && \
    echo '  REACT_APP_API_URL: "${REACT_APP_API_URL}",' >> /scripts/start.sh && \
    echo '};' >> /scripts/start.sh && \
    echo 'EOF' >> /scripts/start.sh && \
    echo 'exec serve -s build -l 3000' >> /scripts/start.sh && \
    chmod +x /scripts/start.sh

EXPOSE 3000

# Usar el script de inicio
CMD ["/scripts/start.sh"]