import type { Environment } from '../types';

export interface ContainerRegistryResources {
  // SST's Cluster component automatically creates:
  // - ECR repositories for each service
  // - Image scanning configuration
  // - Lifecycle policies for image cleanup
  // These are created implicitly and don't need manual definition

  // This file exists for documentation and future explicit ECR configurations
}

export function createContainerRegistryInfrastructure(
  _environment: Environment
): ContainerRegistryResources {
  // SST handles ECR repositories automatically through the Cluster component
  // No explicit ECR resources needed to avoid duplication

  return {};
}
