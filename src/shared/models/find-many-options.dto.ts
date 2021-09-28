import { IsOptional } from 'class-validator';
import FindOneOptionsDTO from './find-one-options.dto';

export default class FindManyOptionsDTO<
  Entity
> extends FindOneOptionsDTO<Entity> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  @IsOptional()
  skip?: number = 0;

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  @IsOptional()
  take?: number = 10;
}
