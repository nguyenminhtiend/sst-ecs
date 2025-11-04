# Build stage
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy package.json files with proper directory structure
COPY packages/common/package.json ./packages/common/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY apps/service1/package.json ./apps/service1/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps/service1 ./apps/service1

# Build packages (@repo/types is just type definitions, no build needed)
RUN pnpm --filter "@repo/common" build
RUN pnpm --filter service1 build

# Production stage
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy package.json files with proper directory structure
COPY packages/common/package.json ./packages/common/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY apps/service1/package.json ./apps/service1/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts from builder
COPY --from=builder /app/packages/common/dist ./packages/common/dist
COPY --from=builder /app/packages/types/src ./packages/types/src
COPY --from=builder /app/apps/service1/dist ./apps/service1/dist

# Set working directory to service
WORKDIR /app/apps/service1

# Expose port
EXPOSE 3001

# Start the service
CMD ["node", "dist/index.js"]

