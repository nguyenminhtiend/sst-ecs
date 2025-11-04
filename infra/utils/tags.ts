export interface TagConfig {
  Environment: string;
  ManagedBy: string;
  Project: string;
  CostCenter?: string;
  Owner?: string;
}

export function createTags(
  environment: string,
  additionalTags: Record<string, string> = {}
): Record<string, string> {
  return {
    Environment: environment,
    ManagedBy: 'sst',
    Project: 'sst-ecs-monorepo',
    ...additionalTags,
  };
}

export function createResourceTags(
  environment: string,
  resourceType: string,
  resourceName: string,
  additionalTags: Record<string, string> = {}
): Record<string, string> {
  return {
    ...createTags(environment, additionalTags),
    ResourceType: resourceType,
    ResourceName: resourceName,
  };
}
