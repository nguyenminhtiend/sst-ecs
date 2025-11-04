/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'sst-ecs-monorepo',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    // Dynamic import - required by SST v3
    const { createInfrastructure } = await import('./infra');

    const environment = $app.stage as any;

    // Create all infrastructure using the modular approach
    const infrastructure = await createInfrastructure(environment);

    // Return outputs
    return {
      vpcId: infrastructure.vpcId,
      clusterName: infrastructure.clusterName,
      service1Name: infrastructure.service1Name,
      service1Url: infrastructure.service1Url,
    };
  },
});
