import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomEntity } from './entities/chat-room.entity';

import { IsExist } from '../core/validators/is-exists.validator';
import { IsNotExist } from '../core/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoomEntity])],
  controllers: [ChatRoomController],
  providers: [ChatRoomService, IsExist, IsNotExist],
})
export class ChatRoomModule {}
