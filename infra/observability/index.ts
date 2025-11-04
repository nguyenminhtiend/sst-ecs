import type { Environment } from '../types';

export interface ObservabilityResources {
  // SST's Cluster component automatically creates:
  // - CloudWatch Log Groups for each service
  // - Log streams for container logs
  // These are created implicitly and don't need manual definition

  // This file exists for documentation and future explicit observability resources
}

export function createObservabilityInfrastructure(
  environment: Environment
): ObservabilityResources {
  // SST handles CloudWatch logs automatically through the Cluster component
  // No explicit observability resources needed to avoid duplication

  return {};
}
