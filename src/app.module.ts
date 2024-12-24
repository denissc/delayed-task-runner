import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DelayedRunnerModule } from "./delayed-runner/DelayedRunner.module";
import { UserModule } from "./user/User.module";
import { PostModule } from './post/Post.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DelayedRunnerModule, UserModule, PostModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
