import { Logger } from '@nestjs/common';
import { DiscoverableProvider } from '../delayed-runner/DiscoverableProvider';

@DiscoverableProvider()
export class PostService {
  async save({ title, body }): Promise<void> {
    Logger.log(`Saved post with ${title} and body: ${body}`);
  }
}