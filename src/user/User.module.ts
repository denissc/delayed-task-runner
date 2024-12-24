import { Module } from '@nestjs/common';
import { UserRepository } from "./User.repository";

@Module({
  providers: [UserRepository],
})
export class UserModule {}