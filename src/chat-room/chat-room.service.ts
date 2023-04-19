import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { IPaginationOptions } from '../core/types/pagination-options';
import { EntityCondition } from '../core/types/entity-condition.type';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
  ) {}
  create(createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomRepository.save(
      this.chatRoomRepository.create(createChatRoomDto),
    );
  }

  findManyWithPagination(paginationOptions: IPaginationOptions) {
    return this.chatRoomRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<ChatRoomEntity>) {
    return this.chatRoomRepository.findOne({
      where: fields,
    });
  }

  update(id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomRepository.save(
      this.chatRoomRepository.create({
        id,
        ...updateChatRoomDto,
      }),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.chatRoomRepository.softDelete(id);
  }
}
