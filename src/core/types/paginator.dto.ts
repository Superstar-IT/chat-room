import { ApiProperty } from '@nestjs/swagger';

export class PaginatorDto<T> {
  @ApiProperty({ isArray: true, type: Array<T> })
  readonly data: T[];

  @ApiProperty({ type: Boolean })
  hasNextPage: boolean;
}
