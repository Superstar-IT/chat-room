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
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { ChatRoomEntity } from './entities/chat-room.entity';
import { PaginatorDto } from '../core/types/paginator.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Chat Room')
@Controller({
  path: 'chatrooms',
  version: '1',
})
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: ChatRoomEntity })
  createChatRoom(
    @Body() createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoomEntity> {
    return this.chatRoomService.create(createChatRoomDto);
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
      await this.chatRoomService.findManyWithPagination({
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
    return await this.chatRoomService.update(room.id, updateChatRoomDto);
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
    return await this.chatRoomService.softDelete(room.id);
  }

  async getSingleChatRoom(id: string): Promise<ChatRoomEntity> {
    const chatRoom = await this.chatRoomService
      .findOne({ id })
      .catch((error) => {
        throw new InternalServerErrorException(
          `Failed to get chat room by id. ${error.message}`,
        );
      });

    if (!chatRoom) throw new NotFoundException(`Chat room not found`);
    return chatRoom;
  }
}
