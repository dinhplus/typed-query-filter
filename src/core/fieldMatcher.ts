import { FieldCondition } from '../types';
import { compileQuery } from './compiler';

export function createFieldMatcher(condition: FieldCondition): (val: any) => boolean {
  if (typeof condition !== 'object' || condition === null || Array.isArray(condition)) {
    return (val: any) => val === condition;
  }

  const matchers = Object.entries(condition).map(([op, expected]) => {
    switch (op) {
      case '$eq': return (val: any) => val === expected;
      case '$ne': return (val: any) => val !== expected;
      case '$gt': return (val: any) => val > expected;
      case '$gte': return (val: any) => val >= expected;
      case '$lt': return (val: any) => val < expected;
      case '$lte': return (val: any) => val <= expected;
      case '$in': return (val: any) => expected.includes(val);
      case '$nin': return (val: any) => !expected.includes(val);
      case '$exists': return (val: any) => expected ? val !== undefined : val === undefined;
      case '$regex': return (val: any) => typeof val === 'string' && new RegExp(expected).test(val);
      case '$not': return (val: any) => !createFieldMatcher(expected)(val);
      case '$all': return (val: any) => Array.isArray(val) && expected.every((v: any) => val.includes(v));
      case '$size': return (val: any) => Array.isArray(val) && val.length === expected;
      case '$elemMatch':
        const matcher = compileQuery(expected);
        return (val: any) => Array.isArray(val) && val.some((item: any) => matcher(item));
      default:
        return () => false;
    }
  });

  return (val: any) => matchers.every(fn => fn(val));
}
