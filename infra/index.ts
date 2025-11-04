import { createNetworkInfrastructure } from './networking';
import { createIamInfrastructure } from './iam';
import { createContainerRegistryInfrastructure } from './container-registry';
import { createObservabilityInfrastructure } from './observability';
import { createComputeInfrastructure } from './compute';
import { getConfig } from './config';
import { validateConfig } from './utils/validation';
import type { Environment } from './types';

export async function createInfrastructure(environment: Environment) {
  // Validate configuration
  const config = getConfig(environment);
  validateConfig(config);

  // 1. Create Network Infrastructure
  const networkResources = createNetworkInfrastructure(environment);

  // 2. Create IAM Infrastructure (documented, but SST handles automatically)
  const iamResources = createIamInfrastructure(environment);

  // 3. Create Container Registry Infrastructure (documented, but SST handles automatically)
  const containerRegistryResources = createContainerRegistryInfrastructure(environment);

  // 4. Create Observability Infrastructure (documented, but SST handles automatically)
  const observabilityResources = createObservabilityInfrastructure(environment);

  // 5. Create Compute Infrastructure (ECS Cluster & Services)
  const computeResources = createComputeInfrastructure(
    networkResources,
    environment
  );

  // Return outputs
  return {
    vpcId: networkResources.vpc.id,
    clusterName: computeResources.cluster.name,
    service1Name: computeResources.services.service1.name,
    service1Url: computeResources.services.service1.url,
  };
}

// Export types for use in sst.config.ts
export type { Environment } from './types';
