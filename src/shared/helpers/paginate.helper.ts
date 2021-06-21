import FindManyOptionsDTO from '../models/find-many-options.dto';
import IMetaModel from '../models/meta.model';

/**
 * Paginates data by attaching it to an object with data and meta parts
 * @param data Data part of the response
 * @param options Options used to filter the response, used to generate currentPage and totalPages properties
 * @param count Total records in the database
 * @returns An object containing data part (as is) and meta part that contains pagination details
 */
export default function paginate<T>(
  data: T,
  options: FindManyOptionsDTO<any>,
  count: number,
): { data: T; meta: IMetaModel } {
  const meta: IMetaModel = {
    currentPage: Math.floor(options.skip / options.take) + 1,
    totalPages: Math.ceil(count / options.take),
    totalRecords: count,
  };
  return {
    data,
    meta,
  };
}
