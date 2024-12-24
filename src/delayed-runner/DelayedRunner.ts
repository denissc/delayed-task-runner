import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { RunnerFunctionCallData, RunnerFunctionContext } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DelayedRunner {
  private readonly queueName = 'tasks';
  private channelWrapper: ChannelWrapper;
  constructor(private readonly configService: ConfigService) {
    const rabbitConnection = this.configService.get('RABBIT_CONNECTION');
    this.queueName = this.configService.get('DELAYED_RUNNER_QUEUE_NAME');
    const connection = amqp.connect([rabbitConnection])
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue(this.queueName, { durable: true });
      },
    });
  }



  async runLater<T, R, P extends Record<string, any>>(cb: (args: T, context: RunnerFunctionContext<R, P>) => Promise<void>, cbData: RunnerFunctionCallData<T, R>): Promise<void> {
    try {
      const message = JSON.stringify({
        fn: cb.toString(),
        data: cbData
      })
      await this.channelWrapper.sendToQueue(
        this.queueName,
        Buffer.from(message),
        {
          persistent: true,
        },
      );
      Logger.log(`Task sent: ${message}`);
    } catch (error) {
      throw new HttpException(
        'Error sending task to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}