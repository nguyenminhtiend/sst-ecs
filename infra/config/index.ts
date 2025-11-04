import { devConfig } from './environments/dev';
import { productionConfig } from './environments/production';
import type { EnvironmentConfig, Environment } from '../types';

export function getConfig(environment: Environment): EnvironmentConfig {
  const configs: Record<Environment, EnvironmentConfig> = {
    dev: devConfig,
    staging: devConfig, // Use dev config for staging
    production: productionConfig,
  };

  const config = configs[environment];
  if (!config) {
    throw new Error(`No configuration found for environment: ${environment}`);
  }

  return config;
}

export * from './constants';
