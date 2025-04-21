import { FieldCondition, NestedCondition, QueryObject } from '../types';
import { compileQuery } from './compiler';
import { getNestedValue } from './getNestedValue';

export function createFieldMatcher(condition: FieldCondition): (val: any) => boolean {
  // Handle primitive comparison
  if (typeof condition !== 'object' || condition === null || Array.isArray(condition)) {
    return (val: any) => val === condition;
  }

  // Check if it's a nested object condition (not an operator condition)
  if (isNestedObjectCondition(condition)) {
    return (val: any) => {
      // If field value is an array, check if any element satisfies all conditions
      if (Array.isArray(val)) {
        return val.some(item => matchNestedCondition(item, condition as NestedCondition));
      }
      // For objects, check if the object itself satisfies all conditions
      else if (val && typeof val === 'object') {
        return matchNestedCondition(val, condition as NestedCondition);
      }
      return false;
    };
  }

  // Handle operators
  const matchers = Object.entries(condition).map(([op, expected]) => {
    switch (op) {
      case '$eq': return (val: any) => val === expected;
      case '$ne': return (val: any) => val !== expected;
      case '$gt': return (val: any) => typeof expected === 'number' && val > expected;
      case '$gte': return (val: any) => typeof expected === 'number' && val >= expected;
      case '$lt': return (val: any) => typeof expected === 'number' && val < expected;
      case '$lte': return (val: any) => typeof expected === 'number' && val <= expected;
      case '$in': return (val: any) => Array.isArray(expected) && expected.includes(val);
      case '$nin': return (val: any) => Array.isArray(expected) && !expected.includes(val);
      case '$some': return (val: any) => Array.isArray(val) && Array.isArray(expected) && val.some((v: any) => expected.includes(v));
      case '$exists': return (val: any) => expected ? val !== undefined : val === undefined;
      
      case '$regex': return (val: any) => {
        // Only strings can be tested with regex
        if (typeof val !== 'string') {
          return false;
        }
        
        try {
          let regex: RegExp;
          
          // If expected is already a RegExp object, use it directly
          if (expected instanceof RegExp) {
            regex = expected;
          }
          // If expected is a string pattern
          else if (typeof expected === 'string') {
            // Check if it's in format '/pattern/flags'
            const slashMatch = expected.match(/^\/(.+)\/([gimsuyd]*)$/);
            if (slashMatch) {
              regex = new RegExp(slashMatch[1], slashMatch[2]);
            } 
            // Check for explicit flags format 'pattern||flags'
            else {
              const parts = expected.split('||');
              if (parts.length === 2) {
                regex = new RegExp(parts[0], parts[1]);
              } else {
                // Regular string pattern without flags
                regex = new RegExp(expected);
              }
            }
          } else {
            // Not a valid regex pattern
            return false;
          }
          
          // Return the result of testing the value with the regex
          return regex.test(val);
        } catch (error) {
          console.error('Invalid regex:', error);
          return false;
        }
      };
      
      case '$not': return (val: any) => !createFieldMatcher(expected)(val);
      case '$all': return (val: any) => Array.isArray(val) && Array.isArray(expected) && expected.every((v: any) => val.includes(v));
      case '$size': return (val: any) => {
        // If checking for size 0 and value is undefined or null, consider it as an empty array
        if (expected === 0 && (val === undefined || val === null)) {
          return true;
        }
        // Normal array size check
        return Array.isArray(val) && val.length === expected;
      };
      case '$elemMatch':
        const matcher = compileQuery(expected as QueryObject<unknown>);
        return (val: any) => Array.isArray(val) && val.some((item: any) => matcher(item));
      default:
        return () => false;
    }
  });

  return (val: any) => matchers.every(fn => fn(val));
}

// Function to determine if a condition is a nested object condition
function isNestedObjectCondition(condition: any): boolean {
  if (condition === null || typeof condition !== 'object' || Array.isArray(condition)) {
    return false;
  }
  
  const keys = Object.keys(condition);
  return keys.length > 0 && !keys.some(key => key.startsWith('$'));
}

// Enhanced function to match a value against a nested object condition
function matchNestedCondition(val: any, condition: NestedCondition): boolean {
  if (!val || typeof val !== 'object') return false;
  
  return Object.entries(condition).every(([field, fieldCondition]) => {
    // Handle dot notation in field names
    if (field.includes('.')) {
      const fieldValue = getNestedValue(val, field);
      return createFieldMatcher(fieldCondition)(fieldValue);
    }
    
    // Direct field access
    const fieldValue = val[field];
    
    // Handle nested objects within the condition
    if (isNestedObjectCondition(fieldCondition) && fieldValue !== undefined) {
      if (Array.isArray(fieldValue)) {
        // If it's an array, check if any element matches the nested condition
        return fieldValue.some(item => matchNestedCondition(item, fieldCondition as NestedCondition));
      } else if (typeof fieldValue === 'object' && fieldValue !== null) {
        // If it's an object, check if it matches the nested condition
        return matchNestedCondition(fieldValue, fieldCondition as NestedCondition);
      }
      return false;
    }
    
    // Regular condition matching
    return createFieldMatcher(fieldCondition)(fieldValue);
  });
}
