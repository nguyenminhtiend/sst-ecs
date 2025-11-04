# SST ECS Monorepo

A production-ready monorepo with Express TypeScript microservices deployed to AWS ECS Fargate + ALB using SST v3 (Ion).

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Application Load Balancer (ALB)         │
│                                                  │
│  Path-based routing:                            │
│  /api/service1/* → Service 1 (Port 3001)        │
│  /api/service2/* → Service 2 (Port 3002)        │
└─────────────────────────────────────────────────┘
                    ↓           ↓
        ┌───────────────┐  ┌───────────────┐
        │   Service 1   │  │   Service 2   │
        │  ECS Fargate  │  │  ECS Fargate  │
        │   (Express)   │  │   (Express)   │
        └───────────────┘  └───────────────┘
```

## Tech Stack

- **Runtime:** Node.js 22
- **Package Manager:** pnpm (workspaces)
- **Framework:** Express + TypeScript (strict mode)
- **IaC:** SST v3 (Ion)
- **Cloud:** AWS ECS Fargate + ALB
- **Logging:** Pino (structured JSON logs → CloudWatch)
- **Secrets:** AWS SSM Parameter Store
- **Containers:** Docker (multi-stage builds)
- **Code Quality:** ESLint + Prettier

## Project Structure

```
/
├── apps/
│   ├── service1/          # Express microservice 1
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── routes/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── service2/          # Express microservice 2
│       ├── src/
│       │   ├── index.ts
│       │   └── routes/
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── common/            # Shared utilities, logger, middleware
│   ├── types/             # Shared TypeScript types
│   └── tsconfig/          # Shared TypeScript configs
├── docker/
│   ├── base.Dockerfile    # Shared base image
│   ├── service1.Dockerfile
│   └── service2.Dockerfile
├── sst.config.ts          # SST infrastructure configuration
├── pnpm-workspace.yaml
└── package.json
```

## Prerequisites

- Node.js 22+
- pnpm 9+
- AWS CLI configured with appropriate credentials
- Docker (for building images)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build Packages

```bash
pnpm build
```

### 3. Development

Run services locally:

```bash
# Service 1
pnpm dev:service1

# Service 2 (in another terminal)
pnpm dev:service2
```

Or use SST dev mode (recommended):

```bash
pnpm dev
```

### 4. Deploy to AWS

```bash
# Deploy to dev stage
pnpm deploy

# Deploy to production
pnpm deploy --stage production
```

## API Endpoints

### Service 1

- `GET /api/service1` - Welcome message
- `GET /api/service1/example` - Example data
- `GET /health` - Health check (with header `x-service: service1`)

### Service 2

- `GET /api/service2` - Welcome message
- `GET /api/service2/data` - List data
- `GET /health` - Health check (with header `x-service: service2`)

## Environment Variables

Services use environment variables loaded from SSM Parameter Store in production:

- `PORT` - Port the service listens on (3001 for service1, 3002 for service2)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

### Setting Secrets

Use AWS CLI to set parameters:

```bash
# Example: Set database URL for service1
aws ssm put-parameter \
  --name "/sst-ecs-monorepo/dev/service1/DATABASE_URL" \
  --value "postgresql://..." \
  --type "SecureString"
```

Then reference in `sst.config.ts`:

```typescript
environment: {
  DATABASE_URL: aws.ssm.Parameter.fromName('DatabaseUrl',
    '/sst-ecs-monorepo/dev/service1/DATABASE_URL'
  ).value
}
```

## Logging

All services use Pino for structured JSON logging:

```typescript
import { logger } from '@repo/common';

logger.info({ userId: 123 }, 'User logged in');
logger.error({ err }, 'Database connection failed');
```

Logs are automatically sent to CloudWatch with:
- Request ID tracking
- HTTP request/response logging
- Timestamp in ISO format
- Structured JSON format for easy parsing

## Available Scripts

```bash
# Development
pnpm dev:service1          # Run service1 locally
pnpm dev:service2          # Run service2 locally
pnpm dev                   # SST dev mode (all services)

# Build
pnpm build                 # Build all packages and services
pnpm type-check            # Type check all packages

# Code Quality
pnpm lint                  # Lint all files
pnpm format                # Format all files
pnpm format:check          # Check formatting

# Deployment
pnpm deploy                # Deploy to AWS (dev stage)
pnpm deploy --stage prod   # Deploy to production

# Cleanup
pnpm clean                 # Clean all build artifacts
```

## Docker

### Local Build Testing

```bash
# Build service1 image
docker build -f docker/service1.Dockerfile -t service1:local .

# Run service1 container
docker run -p 3001:3001 service1:local

# Build service2 image
docker build -f docker/service2.Dockerfile -t service2:local .

# Run service2 container
docker run -p 3002:3002 service2:local
```

### Multi-stage Optimization

Dockerfiles use multi-stage builds:
1. **Builder stage** - Install deps, build TypeScript
2. **Runner stage** - Production-only deps, copy built artifacts

This keeps final images small and secure.

## Adding a New Service

1. Create new service in `apps/`:

```bash
mkdir -p apps/service3/src
```

2. Add `package.json`, `tsconfig.json`, and source files

3. Create `docker/service3.Dockerfile`

4. Update `sst.config.ts`:

```typescript
const service3 = cluster.addService('Service3', {
  image: {
    context: '.',
    dockerfile: 'docker/service3.Dockerfile',
  },
  // ... configuration
});

alb.addListenerRule('Service3Rule', {
  priority: 300,
  conditions: [{ pathPattern: { values: ['/api/service3*'] } }],
  actions: [{ type: 'forward', targetGroup: service3.loadBalancer.targetGroup }],
});
```

5. Deploy: `pnpm deploy`

## CI/CD

Recommended GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Troubleshooting

### Service not responding

Check ECS service logs in CloudWatch:

```bash
aws logs tail /aws/ecs/service1 --follow
```

### Build failures

Clear and reinstall:

```bash
pnpm clean
pnpm install
pnpm build
```

### Docker build issues

Check Docker daemon is running and you have enough disk space:

```bash
docker system df
docker system prune  # Clean up if needed
```

## License

MIT

