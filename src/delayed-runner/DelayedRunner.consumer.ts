import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { Registry } from './Registry';
import { RunnerFunctionCallData } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DelayedRunnerConsumer implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly queueName = 'tasks';
  private readonly logger = new Logger(DelayedRunnerConsumer.name);

  constructor(private readonly registry: Registry, private readonly configService: ConfigService) {
    const rabbitConnection = this.configService.get('RABBIT_CONNECTION');
    this.queueName = this.configService.get('DELAYED_RUNNER_QUEUE_NAME');
    const connection = amqp.connect([rabbitConnection]);
    this.channelWrapper = connection.createChannel();
  }

  async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queueName, { durable: true });
        await channel.consume(this.queueName, async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('Received message:', content);
            await this.processTask(content);
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  private async processTask<R, T>(task: { fn: string, data: RunnerFunctionCallData<R, T> }) {
    const { fn: functionBody, data } = task;
    const providers = this.registry.bindContext(data.context).getProviders();
    const fn = Function("args", "ctx", `return (${functionBody})(args, ctx);`);
    await fn.call(data.context, data.args, { ...data.context, providers });
  }
}
