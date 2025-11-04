export interface NamingConfig {
  appName: string;
  environment: string;
  region: string;
}

export class ResourceNaming {
  constructor(private config: NamingConfig) {}

  // VPC: {app}-{env}-vpc
  vpc(): string {
    return `${this.config.appName}-${this.config.environment}-vpc`;
  }

  // Subnet: {app}-{env}-{type}-subnet-{az}
  subnet(type: 'public' | 'private', az: string): string {
    const azSuffix = az.slice(-1); // Extract 'a', 'b', 'c' from 'us-east-1a'
    return `${this.config.appName}-${this.config.environment}-${type}-subnet-${azSuffix}`;
  }

  // Internet Gateway: {app}-{env}-igw
  internetGateway(): string {
    return `${this.config.appName}-${this.config.environment}-igw`;
  }

  // NAT Gateway: {app}-{env}-nat-{index}
  natGateway(index: number): string {
    return `${this.config.appName}-${this.config.environment}-nat-${index}`;
  }

  // EIP: {app}-{env}-eip-{index}
  eip(index: number): string {
    return `${this.config.appName}-${this.config.environment}-eip-${index}`;
  }

  // Route Table: {app}-{env}-{type}-rt
  routeTable(type: 'public' | 'private', index?: number): string {
    if (type === 'public') {
      return `${this.config.appName}-${this.config.environment}-public-rt`;
    }
    return `${this.config.appName}-${this.config.environment}-private-rt-${index}`;
  }

  // Security Group: {app}-{env}-{name}-sg
  securityGroup(name: string): string {
    return `${this.config.appName}-${this.config.environment}-${name}-sg`;
  }

  // ECS Cluster: {app}-{env}-cluster
  ecsCluster(): string {
    return `${this.config.appName}-${this.config.environment}-cluster`;
  }

  // ECS Service: {app}-{env}-{service}
  ecsService(serviceName: string): string {
    return `${this.config.appName}-${this.config.environment}-${serviceName}`;
  }

  // Task Definition Family: {env}-{service}
  taskDefinitionFamily(serviceName: string): string {
    return `${this.config.environment}-${serviceName}`;
  }

  // ECR Repository: {env}-{service}
  ecrRepository(serviceName: string): string {
    return `${this.config.environment}-${serviceName}`;
  }

  // Log Group: /ecs/{env}/{service}
  logGroup(serviceName: string): string {
    return `/ecs/${this.config.environment}/${serviceName}`;
  }

  // IAM Role: {env}-{name}-role
  iamRole(name: string): string {
    return `${this.config.environment}-${name}-role`;
  }

  // IAM Policy: {env}-{name}-policy
  iamPolicy(name: string): string {
    return `${this.config.environment}-${name}-policy`;
  }

  // SNS Topic: {env}-{name}
  snsTopic(name: string): string {
    return `${this.config.environment}-${name}`;
  }

  // CloudWatch Alarm: {env}-{service}-{metric}
  alarm(serviceName: string, metric: string): string {
    return `${this.config.environment}-${serviceName}-${metric}`;
  }
}
