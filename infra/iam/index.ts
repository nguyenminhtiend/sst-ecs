import type { Environment } from '../types';

export interface IamResources {
  // SST's Cluster component automatically creates:
  // - ECS Task Execution Role (for pulling images, writing logs)
  // - ECS Task Role (for application permissions)
  // These are created implicitly and don't need manual definition

  // This file exists for documentation and future explicit IAM policies
}

export function createIamInfrastructure(
  environment: Environment
): IamResources {
  // SST handles IAM automatically through the Cluster component
  // No explicit IAM resources needed to avoid duplication

  return {};
}
