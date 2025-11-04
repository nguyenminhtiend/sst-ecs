import type { EnvironmentConfig } from '../../types';

export const devConfig: EnvironmentConfig = {
  vpc: {
    cidrBlock: '10.0.0.0/16',
    availabilityZones: ['ap-southeast-1a', 'ap-southeast-1b'],
    publicSubnetCidrs: ['10.0.1.0/24', '10.0.2.0/24'],
    privateSubnetCidrs: ['10.0.10.0/24', '10.0.20.0/24'],
    enableNatGateway: false, // Cost saving for dev
    singleNatGateway: false,
  },
  ecs: {
    service1: {
      cpu: '256',
      memory: '512',
      desiredCount: 1,
      minCapacity: 1,
      maxCapacity: 2,
      containerPort: 3001,
      healthCheckPath: '/health',
      architecture: 'ARM64',
    },
  },
  monitoring: {
    alarmEmail: 'dev-team@example.com',
    logRetentionDays: 7,
    enableDetailedMonitoring: false,
    enableContainerInsights: true,
  },
  tags: {
    Environment: 'dev',
    ManagedBy: 'sst',
    Project: 'sst-ecs-monorepo',
  },
};
