import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';

import { IsNotExist } from '../core/validators/is-not-exists.validator';
import { IsExist } from '../core/validators/is-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [IsExist, IsNotExist, UserService],
  exports: [UserService],
})
export class UserModule {}
