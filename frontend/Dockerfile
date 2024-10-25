FROM node:16-alpine

WORKDIR /app

# Agregar un usuario node y darle permisos
USER node

# Copiar package.json y package-lock.json
COPY --chown=node:node package*.json ./

# Instalar dependencias incluyendo el plugin faltante
RUN npm install && \
    npm install --save-dev @babel/plugin-proposal-private-property-in-object

# Copiar el resto del código
COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "start"]