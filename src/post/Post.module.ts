import { Module } from '@nestjs/common';
import { PostService } from './Post.service';

@Module({
  providers: [PostService],
})
export class PostModule {}