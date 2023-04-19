import { IPaginationOptions } from 'src/core/types/pagination-options';
import { PaginatorDto } from 'src/core/types/paginator.dto';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): PaginatorDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
