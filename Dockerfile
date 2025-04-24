# Establece una imagen base oficial de Node.js
FROM node:21.0-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la app
COPY . .

# Construye la aplicación Next.js
RUN npm run build

# Expone el puerto en el que corre Next.js (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
