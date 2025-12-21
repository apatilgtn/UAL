# Build stage
FROM node:20-alpine AS builder

# Set working directory to the monorepo root
WORKDIR /workspace

# Copy both framework and platform
COPY ual-framework/ ./ual-framework/
COPY ual-platform/ ./ual-platform/

# Install dependencies in platform
WORKDIR /workspace/ual-platform
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /workspace/ual-platform/package*.json ./
COPY --from=builder /workspace/ual-platform/.next ./.next
COPY --from=builder /workspace/ual-platform/public ./public
COPY --from=builder /workspace/ual-platform/node_modules ./node_modules
COPY --from=builder /workspace/ual-platform/prisma ./prisma

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
