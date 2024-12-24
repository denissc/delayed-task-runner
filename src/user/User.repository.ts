import { Logger } from "@nestjs/common";
import { DiscoverableProvider } from '../delayed-runner/DiscoverableProvider';

@DiscoverableProvider()
export class UserRepository {
  cache?: boolean;
  update(id: string, data: any) {
    Logger.log("cache", this.cache);
    Logger.log(`User updated with id ${id}, data ${data}`);
  }
}