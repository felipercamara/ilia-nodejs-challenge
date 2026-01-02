FROM node:lts-alpine AS builder
WORKDIR /app

# Copy package and configuration
COPY package.json tsconfig.json ./

# Copy source code
COPY src ./src

# Install dependencies and build
RUN npm install && npm run build

# Expose application port
EXPOSE 3001


CMD ["node", "dist/main"]
