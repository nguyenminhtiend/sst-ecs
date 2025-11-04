import type { EnvironmentConfig } from '../types';

export function validateConfig(config: EnvironmentConfig): void {
  // Validate VPC CIDR
  if (!isValidCidr(config.vpc.cidrBlock)) {
    throw new Error(`Invalid VPC CIDR: ${config.vpc.cidrBlock}`);
  }

  // Validate subnet counts match AZ counts
  if (config.vpc.publicSubnetCidrs.length !== config.vpc.availabilityZones.length) {
    throw new Error('Public subnet count must match availability zone count');
  }

  if (config.vpc.privateSubnetCidrs.length !== config.vpc.availabilityZones.length) {
    throw new Error('Private subnet count must match availability zone count');
  }

  // Validate ECS configurations
  Object.entries(config.ecs).forEach(([serviceName, serviceConfig]) => {
    if (serviceConfig.minCapacity > serviceConfig.maxCapacity) {
      throw new Error(`${serviceName}: minCapacity cannot exceed maxCapacity`);
    }
    if (serviceConfig.desiredCount < serviceConfig.minCapacity) {
      throw new Error(`${serviceName}: desiredCount cannot be less than minCapacity`);
    }
    if (serviceConfig.desiredCount > serviceConfig.maxCapacity) {
      throw new Error(`${serviceName}: desiredCount cannot exceed maxCapacity`);
    }
  });
}

function isValidCidr(cidr: string): boolean {
  // Basic CIDR validation
  const cidrPattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  return cidrPattern.test(cidr);
}
