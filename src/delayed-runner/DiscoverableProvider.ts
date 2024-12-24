import { applyDecorators, Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
export const DiscoverDecorator = DiscoveryService.createDecorator<string>();
// Use this decorator to discover it for Registry
export function DiscoverableProvider() {
  return applyDecorators(
    Injectable(),
    DiscoverDecorator('provider')
  );
}