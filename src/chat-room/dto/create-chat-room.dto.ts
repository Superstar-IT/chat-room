import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsNotExist } from 'src/core/validators/is-not-exists.validator';

import { getValidateOptions } from 'src/utils/validation';

export class CreateChatRoomDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Id of chat room creator',
    example: '4e481b2b-a86a-4c23-985e-163468e49b68',
  })
  @IsNotEmpty(getValidateOptions(`creatorId required`))
  @IsUUID(undefined, getValidateOptions(`Invalid uuid format`))
  @Validate(IsNotExist, ['UserEntity', 'id'], {
    message: 'user not found',
  })
  creator: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'name of chat room',
    example: 'Chat Room',
  })
  @IsNotEmpty(getValidateOptions(`room name required`))
  @IsString(getValidateOptions(`room name should be string`))
  name: string;

  @ApiProperty({
    type: Array<string>,
    required: false,
    description: 'Ids of room member',
    example: ['4e481b2b-a86a-4c23-985e-163468e49b68'],
    isArray: true,
  })
  @IsOptional()
  @IsArray(getValidateOptions(`Should uuid array`))
  @IsUUID(undefined, getValidateOptions(`Invalid uuid format`))
  members?: string[];
}
