export type Primitive = string | number | boolean | null | undefined;

export type Operator =
  | '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte'
  | '$in' | '$nin' | '$exists' | '$regex'
  | '$not' | '$all' | '$size' | '$elemMatch' | '$where' | '$some';

// Simplified type for all field conditions to avoid deep recursion
export type FieldCondition<T = any> =
  | T
  | { [K in Operator]?: any }
  | { [key: string]: any };

// Simplified query object type
export type QueryObject<T> = {
  [K in keyof T | string]?: FieldCondition | QueryObject<any>;
} | {
  $and?: QueryObject<T>[];
  $or?: QueryObject<T>[];
  $where?: (doc: T) => boolean;
};

// Export types for legacy compatibility
export interface NestedCondition {
  [key: string]: FieldCondition;
}

// Safe flat key type for dot notation
export type DotNotation<T> = string;
