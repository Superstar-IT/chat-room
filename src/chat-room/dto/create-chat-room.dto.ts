import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/core/validators/is-exists.validator';

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
  @Validate(IsExist, ['UserEntity', 'id'], {
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
    type: String,
    required: false,
    description: 'Ids of room member',
    example: ['4e481b2b-a86a-4c23-985e-163468e49b68'],
    isArray: true,
  })
  @IsOptional()
  @IsUUID(undefined, getValidateOptions(`Invalid uuid format`))
  members?: string[];
}
