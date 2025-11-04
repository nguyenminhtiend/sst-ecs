# Build stage
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy package.json files
COPY packages/*/package.json ./packages/
COPY apps/service2/package.json ./apps/service2/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/service2 ./apps/service2

# Build packages (@repo/types is just type definitions, no build needed)
RUN pnpm --filter "@repo/common" build
RUN pnpm --filter service2 build

# Production stage
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy package.json files
COPY packages/*/package.json ./packages/
COPY apps/service2/package.json ./apps/service2/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts from builder
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/types/src ./packages/types/src
COPY --from=builder /app/apps/service2/dist ./apps/service2/dist

# Set working directory to service
WORKDIR /app/apps/service2

# Expose port
EXPOSE 3002

# Start the service
CMD ["node", "dist/index.js"]

