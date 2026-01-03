FROM node:lts-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY tsconfig.json nest-cli.json ./
COPY src ./src

# Build the application
RUN npm install -D @nestjs/cli && npm run build

# Production stage
FROM node:lts-alpine AS production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose application port
EXPOSE 3002

# Start the application
CMD ["node", "dist/main"]