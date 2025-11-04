import { getConfig } from '../config';
import { ResourceNaming } from '../utils/naming';
import { createResourceTags } from '../utils/tags';
import type { Environment } from '../types';

export interface NetworkResources {
  vpc: any; // sst.aws.Vpc type
}

export function createNetworkInfrastructure(
  environment: Environment
): NetworkResources {
  const config = getConfig(environment);
  const naming = new ResourceNaming({
    appName: 'sst-ecs',
    environment,
    region: 'ap-southeast-1',
  });

  // Create VPC using SST's Vpc component with explicit configuration
  // This prevents creating duplicate resources
  const vpc = new sst.aws.Vpc(naming.vpc(), {
    nat: config.vpc.enableNatGateway ? 'managed' : undefined,
    az: config.vpc.availabilityZones.length,
    bastion: false,
  });

  return {
    vpc,
  };
}
