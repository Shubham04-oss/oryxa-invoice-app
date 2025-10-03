# Worker Dockerfile for deployment (Render/Railway)

FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY worker/package*.json ./worker/

# Install dependencies
RUN npm install
RUN cd worker && npm install

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY modules ./modules
COPY worker ./worker

# Set working directory to worker
WORKDIR /app/worker

# Expose health check port (optional)
EXPOSE 3001

# Start worker
CMD ["node", "index.js"]
