# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

# Copy package files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY scripts ./scripts

# Install dependencies (corepack is not distributed with Node 25+)
RUN npm install --global pnpm@11.20.0 && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:26-alpine

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application from builder (include static assets)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Labels for OCI compliance and traceability
LABEL org.opencontainers.image.title="cmnw-next" \
      org.opencontainers.image.description="CMNW Next.js application" \
      org.opencontainers.image.authors="alexzedim" \
      org.opencontainers.image.url="https://github.com/alexzedim/cmnw-next" \
      org.opencontainers.image.source="https://github.com/alexzedim/cmnw-next" \
      org.opencontainers.image.documentation="https://github.com/alexzedim/cmnw-next"

# Start application
CMD ["node_modules/.bin/next", "start"]
