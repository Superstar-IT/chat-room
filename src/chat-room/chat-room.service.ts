import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { IPaginationOptions } from '../core/types/pagination-options';
import { EntityCondition } from '../core/types/entity-condition.type';
import { ChatHistoryEntity } from './entities/chat-history.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,
    @InjectRepository(ChatHistoryEntity)
    private messageRepository: Repository<ChatHistoryEntity>,
  ) {}
  createRoom(createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomRepository.save(
      this.chatRoomRepository.create(createChatRoomDto),
    );
  }

  findManyRoomsWithPagination(paginationOptions: IPaginationOptions) {
    return this.chatRoomRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOneRoom(fields: EntityCondition<ChatRoomEntity>) {
    return this.chatRoomRepository.findOne({
      where: fields,
    });
  }

  updateRoom(id: string, updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomRepository.save(
      this.chatRoomRepository.create({
        id,
        ...updateChatRoomDto,
      }),
    );
  }

  async softDeleteRoom(id: string): Promise<void> {
    await this.chatRoomRepository.softDelete(id);
  }

  saveMessage(message: ChatHistoryEntity) {
    return this.messageRepository.save(message);
  }

  findOneMessage(fields: EntityCondition<ChatHistoryEntity>) {
    return this.messageRepository.findOne({ where: fields });
  }

  findManyMessagesWithPagination(
    findOptions: FindManyOptions<ChatHistoryEntity>,
  ) {
    return this.messageRepository.find(findOptions);
  }

  async softDeleteMessage(id: string): Promise<void> {
    await this.messageRepository.softDelete(id);
  }
}
