import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { isNotEmpty, isUUID } from 'class-validator';

import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { PaginatorDto } from '../core/types/paginator.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { UserService } from 'src/user/user.service';
import { ChatHistoryEntity } from './entities/chat-history.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { getFromDto } from 'src/utils/repository.utils';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Chat Room')
@Controller({
  path: 'chatrooms',
  version: '1',
})
export class ChatRoomController {
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly userService: UserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ChatRoomEntity })
  async createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoomEntity> {
    if (isNotEmpty(createChatRoomDto.members)) {
      await this.validateUserIds(createChatRoomDto.members);
    }
    return this.chatRoomService.createRoom(createChatRoomDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PaginatorDto<ChatRoomEntity> })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  async findAllChatRooms(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatorDto<ChatRoomEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination<ChatRoomEntity>(
      await this.chatRoomService.findManyRoomsWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: ChatRoomEntity })
  async findOneChatRoom(@Param('id') id: string): Promise<ChatRoomEntity> {
    return await this.getSingleChatRoom(id);
  }

  @Patch('message/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: ChatHistoryEntity })
  async updateMessage(
    @Param('id') id: string,
    @Body() messageDto: UpdateMessageDto,
  ): Promise<ChatHistoryEntity> {
    const message = await this.getSingleMessage(id);
    const newMessage = getFromDto<ChatHistoryEntity>(messageDto, message);

    newMessage.id = id;

    return await this.chatRoomService.saveMessage(newMessage);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: ChatRoomEntity })
  async updateChatRoom(
    @Param('id') id: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ): Promise<ChatRoomEntity> {
    const room = await this.getSingleChatRoom(id);
    if (isNotEmpty(updateChatRoomDto.members)) {
      await this.validateUserIds(updateChatRoomDto.members);
    }

    return await this.chatRoomService.updateRoom(room.id, updateChatRoomDto);
  }

  @Delete('message/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  async removeMessage(@Param('id') id: string): Promise<void> {
    const message = await this.getSingleMessage(id);
    return await this.chatRoomService.softDeleteMessage(message.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  async removeChatRoom(@Param('id') id: string): Promise<void> {
    const room = await this.getSingleChatRoom(id);
    return await this.chatRoomService.softDeleteRoom(room.id);
  }

  @Get(':id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: PaginatorDto<ChatHistoryEntity> })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  async getLatestMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatorDto<ChatHistoryEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    const room = await this.getSingleChatRoom(id);
    return infinityPagination<ChatHistoryEntity>(
      await this.chatRoomService.findManyMessagesWithPagination({
        where: { room: { id: room.id } },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      { page, limit },
    );
  }

  @Post(':id/message')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: ChatHistoryEntity })
  async addMessage(
    @Param('id') id: string,
    @Body() messageDto: CreateMessageDto,
  ): Promise<ChatHistoryEntity> {
    const room = await this.getSingleChatRoom(id);
    const isMember = room.memberExists(messageDto.sender);
    if (!isMember)
      throw new ForbiddenException(`You should be member of this room`);
    const sender = await this.userService.findOne({ id: messageDto.sender });

    const newMessage = getFromDto<ChatHistoryEntity>(
      messageDto,
      new ChatHistoryEntity(),
    );
    newMessage.room = room;
    newMessage.sender = sender;

    return await this.chatRoomService.saveMessage(newMessage);
  }

  async validateUserIds(ids: string[]): Promise<boolean> {
    const validUserIds = ids.map((id) => {
      if (!isUUID(id)) throw new BadRequestException(`Invalid uuid format`);
      return id;
    });

    await Promise.all(
      validUserIds.map(async (id) => {
        const user = await this.userService.findOne({ id });
        if (!user) throw new BadRequestException(`User not found: ${id}`);
      }),
    );

    return true;
  }

  async getSingleChatRoom(id: string): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRoomService
      .findOneRoom({ id })
      .catch((error) => {
        throw new InternalServerErrorException(
          `Failed to get chat room by id. ${error.message}`,
        );
      });

    if (!chatRoom) throw new NotFoundException(`Chat room not found`);
    return chatRoom;
  }

  async getSingleMessage(id: string): Promise<ChatHistoryEntity> {
    const message = await this.chatRoomService
      .findOneMessage({ id })
      .catch((error) => {
        throw new InternalServerErrorException(
          `Failed to get message by id. ${error.message}`,
        );
      });

    if (!message) throw new NotFoundException(`Message not found`);
    return message;
  }
}
