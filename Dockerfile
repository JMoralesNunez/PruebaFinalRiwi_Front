# Etapa 1: Construcción con Node
FROM node:22.12 as build-stage
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine as production-stage

# Copiar el resultado del build (carpeta dist) a Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]