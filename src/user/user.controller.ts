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

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { infinityPagination } from '../utils/infinity-pagination';
import { PaginatorDto } from '../core/types/paginator.dto';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PaginatorDto<UserEntity> })
  @ApiQuery({ name: 'page', required: false, type: String, example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: String, example: '10' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatorDto<UserEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination<UserEntity>(
      await this.userService.findManyWithPagination({
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
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.getSingleUser(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ) {
    const user = await this.getSingleUser(id);
    return await this.userService.update(user.id, updateProfileDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    example: '33fe6172-6a04-40b2-acec-ee6ac78b7b74',
  })
  async remove(@Param('id') id: string): Promise<void> {
    const user = await this.getSingleUser(id);
    return await this.userService.softDelete(user.id);
  }

  async getSingleUser(id: string): Promise<UserEntity> {
    const user = await this.userService.findOne({ id }).catch((error) => {
      throw new InternalServerErrorException(
        `Failed to get user by id. ${error.message}`,
      );
    });

    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }
}
