import type { EnvironmentConfig } from '../../types';

export const productionConfig: EnvironmentConfig = {
  vpc: {
    cidrBlock: '10.0.0.0/16',
    availabilityZones: ['ap-southeast-1a', 'ap-southeast-1b', 'ap-southeast-1c'],
    publicSubnetCidrs: ['10.0.1.0/24', '10.0.2.0/24', '10.0.3.0/24'],
    privateSubnetCidrs: ['10.0.10.0/24', '10.0.20.0/24', '10.0.30.0/24'],
    enableNatGateway: true,
    singleNatGateway: false, // Multi-AZ for HA
  },
  ecs: {
    service1: {
      cpu: '512',
      memory: '1024',
      desiredCount: 2,
      minCapacity: 2,
      maxCapacity: 10,
      containerPort: 3001,
      healthCheckPath: '/health',
      architecture: 'ARM64',
    },
  },
  monitoring: {
    alarmEmail: 'ops-team@example.com',
    logRetentionDays: 90,
    enableDetailedMonitoring: true,
    enableContainerInsights: true,
  },
  tags: {
    Environment: 'production',
    ManagedBy: 'sst',
    Project: 'sst-ecs-monorepo',
    CostCenter: 'engineering',
  },
};
