import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { IsExist } from 'src/core/validators/is-exists.validator';
import { getValidateOptions } from 'src/utils/validation';

export class CreateMessageDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Message content',
    example: 'Hi, there!',
  })
  @IsNotEmpty(getValidateOptions(`Message content required`))
  content: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'sender id',
    example: '4e481b2b-a86a-4c23-985e-163468e49b68',
  })
  @IsNotEmpty(getValidateOptions(`sender id required`))
  @IsUUID(undefined, getValidateOptions(`Invalid uuid`))
  @Validate(IsExist, ['UserEntity', 'id'], {
    message: 'user not found',
  })
  sender: string;
}
