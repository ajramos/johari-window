# Usar imagen nginx ligera
FROM nginx:alpine

# Copiar todos los archivos al directorio de nginx
COPY . /usr/share/nginx/html

# Exponer puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Crear configuración personalizada de nginx para usar puerto 8080
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
