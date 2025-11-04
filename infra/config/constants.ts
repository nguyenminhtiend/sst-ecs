export const AWS_REGIONS = {
  US_EAST_1: 'us-east-1',
  US_WEST_2: 'us-west-2',
  EU_WEST_1: 'eu-west-1',
} as const;

export const AVAILABILITY_ZONES = {
  'us-east-1': ['us-east-1a', 'us-east-1b', 'us-east-1c'],
  'us-west-2': ['us-west-2a', 'us-west-2b', 'us-west-2c'],
  'eu-west-1': ['eu-west-1a', 'eu-west-1b', 'eu-west-1c'],
} as const;

export const APP_NAME = 'sst-ecs';
export const PROJECT_NAME = 'sst-ecs-monorepo';
