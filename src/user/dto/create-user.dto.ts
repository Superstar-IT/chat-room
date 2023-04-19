import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsNotExist } from '../../core/validators/is-not-exists.validator';
import { getValidateOptions } from '../../utils/validation';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'user email',
    example: 'test1@example.com',
  })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty(getValidateOptions(`use email required`))
  @Validate(IsNotExist, ['UserEntity'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail(undefined, getValidateOptions(`Invalid email format`))
  email: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'First name',
    example: 'Robert',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Last name',
    example: 'Wiliam',
  })
  @IsString()
  @IsOptional()
  lastName?: string;
}
