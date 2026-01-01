# Build stage
FROM node:20-alpine AS builder

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Labels for OCI compliance and traceability
LABEL org.opencontainers.image.title="cmnw-next" \
      org.opencontainers.image.description="CMNW Next.js application" \
      org.opencontainers.image.authors="alexzedim" \
      org.opencontainers.image.url="https://github.com/alexzedim/cmnw-next" \
      org.opencontainers.image.source="https://github.com/alexzedim/cmnw-next" \
      org.opencontainers.image.documentation="https://github.com/alexzedim/cmnw-next"

# Use dumb-init to handle signals properly (correct path for Alpine)
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start application
CMD ["node_modules/.bin/next", "start"]
