import { FieldCondition, QueryObject } from '../types';
import { createFieldMatcher } from './fieldMatcher';
import { getNestedValue } from './getNestedValue';
import { FlatKey } from './flatKey';

const matcherCache = new WeakMap<object, Function>();

export function compileQuery<T>(query: QueryObject<T>): (obj: T) => boolean {
  if (matcherCache.has(query)) {
    return matcherCache.get(query)! as (obj: T) => boolean;
  }

  const matcher: (obj: T) => boolean = (obj: T) => {
    if ('$and' in query || '$or' in query || '$where' in query) {
      const ands = (query as any).$and?.map(compileQuery) ?? [];
      const ors = (query as any).$or?.map(compileQuery) ?? [];
      const where = (query as any).$where;

      const andMatch = ands.every((fn: (arg0: T) => any) => fn(obj));
      const orMatch = ors.length === 0 || ors.some((fn: (arg0: T) => any) => fn(obj));
      const whereMatch = typeof where === 'function' ? where(obj) : true;

      return andMatch && orMatch && whereMatch;
    }

    const conditions = Object.entries(query).map(([field, condition]) => {
      const matcher = createFieldMatcher(condition as FieldCondition);
      return (obj: T) => matcher(getNestedValue(obj, field as FlatKey<T>));
    });

    return conditions.every(fn => fn(obj));
  };

  matcherCache.set(query, matcher);
  return matcher;
}
