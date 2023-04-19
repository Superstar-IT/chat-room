import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { IsExist } from 'src/core/validators/is-exists.validator';

import { getValidateOptions } from 'src/utils/validation';

export class AddChatRoomMemberDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Id of chat room',
    example: '4e481b2b-a86a-4c23-985e-163468e49b68',
  })
  @IsNotEmpty(getValidateOptions(`room id required`))
  @IsUUID(undefined, getValidateOptions(`Invalid uuid format`))
  @Validate(IsExist, ['ChatRoomEntity', 'id'], {
    message: 'chat room not found',
  })
  roomId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User Id',
    example: '4e481b2b-a86a-4c23-985e-163468e49b68',
  })
  @IsNotEmpty(getValidateOptions(`user id required`))
  @IsUUID(undefined, getValidateOptions(`Invalid uuid format`))
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'user not found',
  })
  userId: string;
}
