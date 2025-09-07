# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Only install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Final runtime image
FROM node:22-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodegroup && \
    adduser -u 1001 -S nodeuser -G nodegroup

WORKDIR /app

# Copy dependencies
COPY --from=build /app/node_modules ./node_modules

# Copy app source
COPY . .

# Change ownership of app files to the non-root user
RUN chown -R nodeuser:nodegroup /app

# Use environment variables
ENV NODE_ENV=production
ENV USE_DOCKER_PYTHON=true

EXPOSE 5001

# Switch to non-root user
USER nodeuser

CMD ["node", "index.js"]