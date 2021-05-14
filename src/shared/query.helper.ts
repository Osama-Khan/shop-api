import { HttpException, HttpStatus } from '@nestjs/common';

export default class QueryHelper {
  /**
   * Creates an object from a stream of given filters
   * @param filterStream A stream of filters in key=value format separated by semicolon
   * @param prototype Prototype of object to use keys of for verification
   * @returns Object with `key: value` set of conditions
   */
  static filterObjectFrom(filterStream: string, prototype = undefined) {
    if (!filterStream) return {};
    const filters = filterStream.split(';');
    const obj = {};
    filters.forEach((f, i) => {
      const keyVal = f.split('=');
      const [key, val] = keyVal;
      if (
        keyVal.length !== 2 ||
        (prototype && Object.getOwnPropertyNames(prototype).indexOf(key) === -1)
      ) {
        throw new HttpException(
          `Invalid key value pair for filter at index ${i}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      obj[key] = val;
    });
    return obj;
  }
}
