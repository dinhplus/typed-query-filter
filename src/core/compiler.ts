import { FieldCondition, QueryObject, NestedCondition } from '../types';
import { createFieldMatcher } from './fieldMatcher';
import { getNestedValue } from './getNestedValue';
import { FlatKey } from './flatKey';

const matcherCache = new WeakMap<object, Function>();


function checkDepth(obj: any, maxDepth: number = 10): boolean {
  if (maxDepth <= 0) return false;
  
  if (obj === null || typeof obj !== 'object') return true;
  
  for (const key in obj) {
    if (!checkDepth(obj[key], maxDepth - 1)) return false;
  }
  
  return true;
}


function createArrayNestedMatcher(arrayField: any[], condition: Record<string, any>, depth: number = 5): boolean {

  if (depth <= 0) return false;
  
  return arrayField.some(item => {
    return Object.entries(condition).every(([nestedField, nestedCondition]) => {
      if (nestedField.includes('.')) {
        const nestedValue = getNestedValue(item, nestedField as any);
        const nestedMatcher = createFieldMatcher(nestedCondition as FieldCondition);
        return nestedMatcher(nestedValue);
      } 
      else if (isNestedObjectCondition(nestedCondition) && item[nestedField] !== undefined) {
        // Nếu là mảng, xử lý với độ sâu giảm dần
        if (Array.isArray(item[nestedField])) {
          return createArrayNestedMatcher(item[nestedField], nestedCondition as Record<string, any>, depth - 1);
        } else if (typeof item[nestedField] === 'object' && item[nestedField] !== null) {
          // Nếu là object, xử lý với độ sâu giảm dần
          return Object.entries(nestedCondition as Record<string, any>).every(
            ([deepField, deepCondition]) => {
              const deepValue = item[nestedField][deepField];
              const deepMatcher = createFieldMatcher(deepCondition as FieldCondition);
              return deepMatcher(deepValue);
            }
          );
        }
        return false;
      } 
      else {
        const nestedValue = item[nestedField];
        const nestedMatcher = createFieldMatcher(nestedCondition as FieldCondition);
        return nestedMatcher(nestedValue);
      }
    });
  });
}

export function compileQuery<T>(query: QueryObject<T>, depth: number = 8): (obj: T) => boolean {

  if (depth <= 0 || !checkDepth(query, 10)) {
    console.warn('Query too complex or depth exceeded, using simplified evaluation');
    return () => true; // Fallback cho truy vấn quá phức tạp
  }
  
  // Cache check
  if (matcherCache.has(query)) {
    return matcherCache.get(query)! as (obj: T) => boolean;
  }

  const matcher: (obj: T) => boolean = (obj: T) => {
    // Handle logical operators
    if ('$and' in query || '$or' in query || '$where' in query) {
      const ands = (query as any).$and?.map((q: any) => compileQuery(q, depth - 1)) ?? [];
      const ors = (query as any).$or?.map((q: any) => compileQuery(q, depth - 1)) ?? [];
      const where = (query as any).$where;

      const andMatch = ands.every((fn: (arg0: T) => any) => fn(obj));
      const orMatch = ors.length === 0 || ors.some((fn: (arg0: T) => any) => fn(obj));
      const whereMatch = typeof where === 'function' ? where(obj) : true;

      return andMatch && orMatch && whereMatch;
    }

    // Handle field conditions
    const conditions = Object.entries(query).map(([field, condition]) => {
      // Handle dot notation in field paths
      if (field.includes('.') && !isSpecialOperator(field)) {
        return (obj: T) => {
          const segments = field.split('.');
          const firstSegment = segments[0] as keyof T;
          const value = obj[firstSegment];

          // Handle array traversal in dot notation
          if (Array.isArray(value)) {
            const remainingPath = segments.slice(1).join('.');
            // Check if any array element matches the condition
            return value.some(item => {
              const nestedValue = getNestedValue(item, remainingPath as any);
              const nestedMatcher = createFieldMatcher(condition as FieldCondition);
              return nestedMatcher(nestedValue);
            });
          }

          // Regular path traversal
          const matcher = createFieldMatcher(condition as FieldCondition);
          return matcher(getNestedValue(obj, field as FlatKey<T>));
        };
      }

      // Handle nested object conditions (no dot notation)
      if (isNestedObjectCondition(condition)) {
        return (obj: T) => {
          const fieldValue = obj[field as keyof T];
          
          // Handle array fields với độ sâu kiểm soát
          if (Array.isArray(fieldValue)) {
            return createArrayNestedMatcher(fieldValue, condition as Record<string, any>, depth - 1);
          } 
          // Handle object fields với độ sâu kiểm soát
          else if (fieldValue && typeof fieldValue === 'object') {
            const nestedQuery = compileQuery<any>({ ...condition }, depth - 1);
            return nestedQuery(fieldValue);
          }
          return false;
        };
      }

      // Handle regular field conditions (primitives, operators)
      const matcher = createFieldMatcher(condition as FieldCondition);
      return (obj: T) => matcher(getNestedValue(obj, field as FlatKey<T>));
    });

    return conditions.every(fn => fn(obj));
  };

  // Cache the matcher
  matcherCache.set(query, matcher);
  return matcher;
}

function isSpecialOperator(field: string): boolean {
  return field.startsWith('$');
}

function isNestedObjectCondition(condition: any): boolean {
  if (condition === null || typeof condition !== 'object' || Array.isArray(condition)) {
    return false;
  }
  
  const keys = Object.keys(condition);
  return keys.length > 0 && !keys.some(key => isSpecialOperator(key));
}
