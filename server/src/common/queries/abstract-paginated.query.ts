import { Type } from 'class-transformer';
import { IsPositiveIntOrUndefined } from '../decorators/validations/is-positive-int-or-undefined.decorator';
import { IsOptional, Max, Min } from 'class-validator';

export abstract class AbstractPaginatedQuery {
  @IsOptional()
  @IsPositiveIntOrUndefined()
  @Type(() => Number)
  @Min(1)
  @Max(1000000)
  public page: number | 1;

  @IsOptional()
  @IsPositiveIntOrUndefined()
  @Type(() => Number)
  @Max(500)
  @Min(1)
  public limit: number | 25;
}
