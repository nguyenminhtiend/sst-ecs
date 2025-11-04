# Infrastructure Documentation

## Overview
This directory contains all infrastructure-as-code definitions for the SST ECS project, refactored from the original monolithic `sst.config.ts` into a modular, explicit structure.

## Architecture Principles

### SST Component Usage
This refactoring uses SST's high-level components (`sst.aws.Vpc`, `sst.aws.Cluster`) which provide:
- **Automatic resource management**: ECR repositories, IAM roles, CloudWatch logs
- **Best practices built-in**: Security groups, task definitions, log retention
- **No resource duplication**: Components handle underlying AWS resources efficiently
- **Type safety**: Full TypeScript support with proper types

### What We Made Explicit
- **Network configuration**: VPC, NAT gateway settings, availability zones
- **Environment-specific configs**: Different settings for dev vs production
- **Service configuration**: CPU, memory, scaling, health checks
- **Naming conventions**: Consistent resource naming across all environments
- **Tags**: Standard tagging for cost allocation and organization

### What SST Handles Automatically
- **IAM Roles & Policies**: Task execution and task roles with proper permissions
- **ECR Repositories**: One per service with lifecycle policies
- **CloudWatch Logs**: Log groups and streams for each service
- **Security Groups**: Proper ingress/egress rules for services
- **Task Definitions**: Container definitions with proper configuration
- **Load Balancing**: Public access configuration

## Directory Structure

```
infra/
├── index.ts                    # Main infrastructure orchestration
├── README.md                   # This file
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   ├── naming.ts              # Resource naming conventions
│   ├── tags.ts                # Tagging helpers
│   └── validation.ts          # Configuration validation
├── config/
│   ├── index.ts               # Configuration loader
│   ├── constants.ts           # AWS constants
│   └── environments/
│       ├── dev.ts             # Development environment config
│       └── production.ts      # Production environment config
├── networking/
│   └── index.ts               # VPC configuration
├── iam/
│   └── index.ts               # IAM documentation (handled by SST)
├── container-registry/
│   └── index.ts               # ECR documentation (handled by SST)
├── observability/
│   └── index.ts               # CloudWatch documentation (handled by SST)
└── compute/
    └── index.ts               # ECS cluster and services
```

## Environments

### Development (`dev`)
- **Cost-optimized**: No NAT Gateway, single-AZ where possible
- **Minimal resources**: 1 task per service, smaller CPU/memory
- **Fast iteration**: Short log retention (7 days)
- **Public subnets**: Services accessible directly

### Production (`production`)
- **High availability**: Multi-AZ deployment with NAT Gateway
- **Redundancy**: Multiple tasks, higher capacity limits
- **Compliance**: 90-day log retention
- **Private subnets**: Services in private subnets with NAT

## Configuration

### Adding a New Service

1. **Update environment config** (`config/environments/*.ts`):
```typescript
ecs: {
  service1: { /* existing */ },
  service2: {  // Add new service config
    cpu: '256',
    memory: '512',
    desiredCount: 1,
    minCapacity: 1,
    maxCapacity: 2,
    containerPort: 3002,
    healthCheckPath: '/health',
    architecture: 'ARM64',
  },
}
```

2. **Add service to compute layer** (`compute/index.ts`):
```typescript
const service2 = cluster.addService('Service2', {
  image: {
    context: '.',
    dockerfile: 'docker/service2.Dockerfile',
  },
  // ... configuration from config.ecs.service2
});
```

3. **Export service in main index** (`index.ts`):
```typescript
return {
  // ...
  service2Url: computeResources.services.service2.url,
};
```

### Modifying Environment Settings

Edit the appropriate file in `config/environments/`:
- `dev.ts` - Development settings
- `production.ts` - Production settings

Configuration is validated on deployment using `utils/validation.ts`.

## Resource Naming Convention

Format: `{environment}-{resource-type}-{name}`

Examples:
- VPC: `sst-ecs-dev-vpc`
- Cluster: `sst-ecs-dev-cluster`
- Service: `sst-ecs-dev-service1`
- Log Group: `/ecs/dev/service1`

See `utils/naming.ts` for the complete naming strategy.

## Tags

All resources are automatically tagged with:
- `Environment`: dev, staging, or production
- `ManagedBy`: sst
- `Project`: sst-ecs-monorepo
- `ResourceType`: VPC, ECSCluster, etc.
- `ResourceName`: Resource-specific name

Additional tags can be added in environment configs.

## Deployment

### Deploy to Development
```bash
pnpm sst deploy --stage dev
```

### Deploy to Production
```bash
pnpm sst deploy --stage production
```

### Remove Resources
```bash
pnpm sst remove --stage dev
```

## Benefits of This Structure

1. **Maintainability**: Each concern is separated into its own module
2. **Type Safety**: Full TypeScript support with validation
3. **Environment Parity**: Same structure for all environments, different configs
4. **Documentation**: Clear where each resource is defined
5. **No Duplication**: Uses SST components efficiently to avoid creating redundant resources
6. **Scalability**: Easy to add new services or environments
7. **Cost Visibility**: Clear separation between dev (cheap) and prod (robust)

## Migration from Original sst.config.ts

The original 54-line `sst.config.ts` has been refactored into this modular structure without changing the deployed resources:

**Before**:
- Single file with all configuration
- Implicit SST defaults
- Mixed concerns (networking + compute + config)

**After**:
- Modular structure with clear separation
- Explicit configuration per environment
- Type-safe with validation
- Same SST components (no new resources)
- Clear documentation

## Troubleshooting

### TypeScript Errors
- Ensure all imports use correct relative paths
- Check that `Environment` type is properly imported
- Verify SST types are available (`.sst/platform/config.d.ts`)

### Deployment Errors
- Run validation: Check error messages from `utils/validation.ts`
- Check AWS credentials: `aws sts get-caller-identity --profile sst`
- Review CloudWatch logs for service errors

### Resource Conflicts
- This structure uses SST components which prevent duplication
- If conflicts occur, check for manual AWS resources with same names
- Use `aws ecs list-clusters` to see existing resources

## Future Enhancements

Possible additions (not implemented to avoid resource duplication):
- Application Load Balancer (ALB)
- RDS/DynamoDB databases
- S3 buckets for static assets
- CloudWatch dashboards
- Custom CloudWatch alarms
- Secrets Manager integration
- Auto-scaling policies
- Blue/green deployments

## References

- [SST Documentation](https://sst.dev/)
- [SST VPC Component](https://sst.dev/docs/component/aws/vpc)
- [SST Cluster Component](https://sst.dev/docs/component/aws/cluster)
- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
