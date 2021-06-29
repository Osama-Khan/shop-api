import { BadRequestException, PipeTransform } from '@nestjs/common';
import {
  Equal,
  MoreThan,
  LessThan,
  MoreThanOrEqual,
  LessThanOrEqual,
  Not,
  ILike,
  FindOperator,
} from 'typeorm';

type FilterError =
  | 'invalidParamLength'
  | 'emptyParam'
  | 'invalidKeyInParam'
  | 'invalidOperator';
type FilterOperator =
  | '='
  | '>'
  | '<'
  | '>='
  | '<='
  | '!='
  | 'like'
  | 'not like';

class FilterException extends BadRequestException {
  constructor(errorType?: FilterError, errorIndex?: number) {
    const name = 'FilterException';
    let message = '';
    if (!errorType) {
      message = 'Invalid key:operator:value for filters';
    } else {
      switch (errorType) {
        case 'invalidParamLength':
          message =
            'There must be only 2 or 3 parameters: key, value, and optionally operator in filters';
          break;
        case 'emptyParam':
          message = 'One of the given parameters is empty in filters';
          break;
        case 'invalidKeyInParam':
          message = 'Filtering is not allowed by the provided key ';
          break;
        case 'invalidOperator':
          message = 'Invalid operator given for filters';
          break;
        default:
          message = 'Unknown error in filters';
      }
    }
    if (errorIndex || errorIndex === 0)
      message += ` at filter index ${errorIndex}`;
    super(message, name);
  }
}

export class FiltersValidationPipe implements PipeTransform {
  /**
   * @param validProps an array of valid properties
   */
  constructor(private validProps?: string[]) {}
  transform(filters: string | any) {
    if (filters) {
      const f = filters.split(';');
      const obj = {};
      f.forEach((f: string, i: number) => {
        const [key, operator, val] = this.filterSplit(f, i);
        if (this.validProps && !this.validProps.includes(key)) {
          this.throwError('invalidKeyInParam', i);
        }
        const opt = this.toFindOperator(operator as FilterOperator, val);
        if (!opt) this.throwError('invalidOperator', i);
        obj[key] = opt;
      });
      filters = obj;
    }
    return filters;
  }

  /**
   * Splits filters into an array. '=' operator is added by default if no operator is provided
   * @param sequence Sequence of filters in key:operator:value format where operator is optional
   * @param index Index of the sequence used to notify user of the index at which error occured
   * @returns A string array of format [key, operator, value]
   */
  private filterSplit = (sequence: string, index?: number) => {
    let out: string[] = [];
    let lastAdd = 0;
    let isColon = false,
      wasColon = false,
      isLastIteration = false;
    for (let i = 1; i < sequence.length; i++) {
      [isColon, isLastIteration] = [
        sequence[i] === ':' && sequence[i - 1] !== '\\',
        i === sequence.length - 1,
      ];

      // Two consecutive colons or string ends with a colon
      const emptyParam = (isColon && wasColon) || (isColon && isLastIteration);
      if (emptyParam) this.throwError('emptyParam', index);

      if (isColon || isLastIteration) {
        const substrEnd = isLastIteration ? sequence.length : i;
        const toPush = sequence.substring(lastAdd, substrEnd);
        out.push(toPush);
        if (out.length > 3) this.throwError('invalidParamLength', index);
        lastAdd = i + 1;
      }
      wasColon = isColon;
    }
    if (out.length < 2) this.throwError('invalidParamLength', index);
    if (out.length === 2) out = [out[0], '=', out[1]]; // Default operator '='
    return out;
  };

  /**
   * Converts string operator and value to FindOperator
   * @returns FindOperator object with operator applied
   */
  private toFindOperator(
    operator: FilterOperator,
    value: string,
  ): FindOperator<string> | undefined {
    return operator === '='
      ? Equal(value)
      : operator === '>'
      ? MoreThan(value)
      : operator === '<'
      ? LessThan(value)
      : operator === '>='
      ? MoreThanOrEqual(value)
      : operator === '<='
      ? LessThanOrEqual(value)
      : operator === '!='
      ? Not(Equal(value))
      : operator === 'like'
      ? ILike(value)
      : operator === 'not like'
      ? Not(ILike(value))
      : undefined;
  }

  /**
   * Throws a FilterException of the specified error type
   * @param errorType Type of error
   * @param index index of filters at which error occurred
   */
  private throwError = (errorType?: FilterError, index?: number) => {
    throw new FilterException(errorType, index);
  };
}
