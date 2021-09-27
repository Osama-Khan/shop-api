import { IsOptional } from 'class-validator';
import { FindConditions, ObjectLiteral } from 'typeorm';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

export default class FindOneOptionsDTO<Entity> {
  /**
   * Specifies what columns should be retrieved.
   */
  @IsOptional()
  select?: (keyof Entity)[];

  /**
   * Simple condition that should be applied to match entities.
   */
  @IsOptional()
  where?:
    | FindConditions<Entity>[]
    | FindConditions<Entity>
    | ObjectLiteral
    | string;

  /**
   * Indicates what relations of entity should be loaded (simplified left join form).
   */
  @IsOptional()
  relations?: string[];

  /**
   * Order, in which entities should be ordered.
   */
  @IsOptional()
  order?: {
    [P in EntityFieldsNames<Entity>]?: 'ASC' | 'DESC' | 1 | -1;
  };

  /**
   * Indicates if soft-deleted rows should be included in entity result.
   */
  @IsOptional()
  withDeleted?: boolean;
}
