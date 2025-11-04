import { getConfig } from '../config';
import { ResourceNaming } from '../utils/naming';
import type { Environment } from '../types';
import type { NetworkResources } from '../networking';

export interface ComputeResources {
  cluster: any; // sst.aws.Cluster type
  services: {
    service1: any; // Service type
  };
}

export function createComputeInfrastructure(
  networkResources: NetworkResources,
  environment: Environment
): ComputeResources {
  const config = getConfig(environment);
  const naming = new ResourceNaming({
    appName: 'sst-ecs',
    environment,
    region: 'ap-southeast-1',
  });

  // Create ECS Cluster using SST's Cluster component
  const cluster = new sst.aws.Cluster(naming.ecsCluster(), {
    vpc: networkResources.vpc,
  });

  // Get service1 configuration
  const service1Config = config.ecs.service1;

  // Convert CPU and memory to SST format
  // CPU: 256 -> "0.25 vCPU", 512 -> "0.5 vCPU", 1024 -> "1 vCPU"
  const cpuInVCPU = parseInt(service1Config.cpu) / 1024;
  const cpuStr = cpuInVCPU >= 1 ? `${cpuInVCPU} vCPU` : `${cpuInVCPU} vCPU`;

  // Memory: 512 -> "0.5 GB", 1024 -> "1 GB", 2048 -> "2 GB"
  const memoryInGB = parseInt(service1Config.memory) / 1024;
  const memoryStr = memoryInGB >= 1 ? `${memoryInGB} GB` : `${memoryInGB} GB`;

  // Create Service1 using SST's addService method
  const service1 = cluster.addService('Service1', {
    image: {
      context: '.',
      dockerfile: 'docker/service1.Dockerfile',
    },
    architecture: service1Config.architecture.toLowerCase() as 'arm64' | 'x86_64',
    cpu: cpuStr as any,
    memory: memoryStr as any,
    public: {
      ports: [
        {
          listen: '80/http',
          forward: `${service1Config.containerPort}/http`,
        },
      ],
    },
    environment: {
      PORT: service1Config.containerPort.toString(),
      NODE_ENV: environment === 'production' ? 'production' : 'development',
      LOG_LEVEL: 'info',
    },
    dev: {
      command: 'pnpm --filter service1 dev',
    },
  });

  return {
    cluster,
    services: {
      service1,
    },
  };
}
