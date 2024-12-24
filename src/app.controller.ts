import { Controller, Get } from "@nestjs/common";
import { DelayedRunner } from "./delayed-runner/DelayedRunner";
import { UserRepository } from "./user/User.repository";
import { PostService } from './post/Post.service';

interface RunnerArgs {
  id: string;
  newName: string;
  post: { title: string, body: string }
}

interface RunnerProviders {
  UserRepository: UserRepository,
  PostService: PostService
}

@Controller()
export class AppController {
  constructor(private readonly delayedRunner: DelayedRunner) {}

  @Get('run')
  async run(): Promise<string> {
    const id = "1234";
    const newName = "John Doe";
    const post = { title: "Hello", body: "world" };

    await this.delayedRunner.runLater<RunnerArgs, { cache: boolean}, RunnerProviders>
    (async (args, ctx) => {
      ctx.providers.UserRepository.update(args.id, {name: args.newName});
      await ctx.providers.PostService.save(args.post);
    }, {
      args: { id, newName, post },
      context: { cache: true }
    });

    return 'It works! :)';
  }
}
