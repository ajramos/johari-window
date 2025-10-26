# Build backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
COPY server/server.js ./
RUN npm install --production

# Final image with nginx + backend
FROM nginx:alpine

# Install Node.js in final image
RUN apk add --no-cache nodejs npm

# Copy backend from build stage
COPY --from=backend /app /app/backend

# Copy frontend files
COPY index.html participant.html admin.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY favicon.svg /usr/share/nginx/html/

# Create nginx config that proxies API to backend
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    \
    location /api/ { \
        proxy_pass http://127.0.0.1:3000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]
