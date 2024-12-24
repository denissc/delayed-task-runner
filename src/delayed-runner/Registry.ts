import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { DiscoverDecorator } from './DiscoverableProvider';

@Injectable()
export class Registry implements OnModuleInit {
  private readonly logger = new Logger(Registry.name);
  private providers: Record<string | symbol, unknown> = {};

  constructor(private readonly discoveryService: DiscoveryService) {}


  onModuleInit(): any {
    this.scanProviders();
  }

  bindContext(context: any) {
    Object.keys(this.providers).forEach((providerToken) => {
      Object.assign(this.providers[providerToken], context);
    });
    return this;
  }

  getProviders(): Record<string, unknown> {
    return this.providers;
  }

  private scanProviders() {
    this.providers = this.discoveryService
      .getProviders({metadataKey: DiscoverDecorator.KEY})
      .reduce((acc, wrapper) => {
        this.logger.log(wrapper.name || wrapper.token);
        if (wrapper.instance) {
          acc[wrapper.name || wrapper.token] = wrapper.instance;
        }
        return acc;
      }, {});
  }
}