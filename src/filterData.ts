import { QueryObject } from './types';
import { compileQuery } from './core/compiler';

export function filterData<T>(data: T[], query: QueryObject<T>): T[] {
  const matcher = compileQuery<T>(query);
  return data.filter(matcher);
}
