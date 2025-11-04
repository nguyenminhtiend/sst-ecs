// Environment types
export type Environment = 'dev' | 'staging' | 'production';
export type Region = 'us-east-1' | 'us-west-2' | 'eu-west-1';

// VPC Configuration
export interface VpcConfig {
  cidrBlock: string;
  availabilityZones: string[];
  publicSubnetCidrs: string[];
  privateSubnetCidrs: string[];
  enableNatGateway: boolean;
  singleNatGateway: boolean;
}

// ECS Service Configuration
export interface ServiceConfig {
  cpu: string;
  memory: string;
  desiredCount: number;
  minCapacity: number;
  maxCapacity: number;
  containerPort: number;
  healthCheckPath: string;
  architecture: 'ARM64' | 'X86_64';
}

export interface EcsConfig {
  [serviceName: string]: ServiceConfig;
}

// Monitoring Configuration
export interface MonitoringConfig {
  alarmEmail: string;
  logRetentionDays: number;
  enableDetailedMonitoring: boolean;
  enableContainerInsights: boolean;
}

// Tag Configuration
export interface TagConfig {
  Environment: string;
  ManagedBy: string;
  Project: string;
  CostCenter?: string;
  Owner?: string;
}

// Environment Configuration
export interface EnvironmentConfig {
  vpc: VpcConfig;
  ecs: EcsConfig;
  monitoring: MonitoringConfig;
  tags: TagConfig;
}
