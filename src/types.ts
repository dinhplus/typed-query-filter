export type Primitive = string | number | boolean | null | undefined;

export type Operator =
  | '$eq' | '$ne' | '$gt' | '$gte' | '$lt' | '$lte'
  | '$in' | '$nin' | '$exists' | '$regex'
  | '$not' | '$all' | '$size' | '$elemMatch' | '$where' | '$hasSome';

export type FieldCondition =
  | { [K in Operator]?: any }
  | Primitive;

export type LogicalQuery<T> = {
  $and?: QueryObject<T>[];
  $or?: QueryObject<T>[];
  $where?: (doc: T) => boolean;
}

export type QueryObject<T> = LogicalQuery<T> | {
  [K in keyof T | string]?: FieldCondition;
};
