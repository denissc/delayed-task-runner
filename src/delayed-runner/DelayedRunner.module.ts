import { Module } from '@nestjs/common';
import { DelayedRunnerConsumer } from './DelayedRunner.consumer';
import { DelayedRunner } from './DelayedRunner';
import { DiscoveryModule } from "@nestjs/core";
import { Registry } from './Registry';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DiscoveryModule, ConfigModule],
  providers: [DelayedRunnerConsumer, DelayedRunner, Registry],
  exports: [DelayedRunner],
})
export class DelayedRunnerModule {}