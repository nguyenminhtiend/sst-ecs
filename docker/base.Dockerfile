# Base stage with dependencies
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./

# Copy all package.json files
COPY packages/*/package.json ./packages/
COPY apps/*/package.json ./apps/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages ./packages
COPY apps ./apps

# Build shared packages
RUN pnpm --filter "@repo/*" build

