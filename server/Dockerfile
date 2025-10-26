FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy server files
COPY . .

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]

