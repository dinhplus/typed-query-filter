import { FieldCondition, QueryObject } from './types';
import { FlatKey, getFlatKeys } from './core/flatKey';
import { getNestedValue } from './core/getNestedValue';
import { filterData } from './filterData';

export class QueryBuilder<T extends object> {
  private query: QueryObject<T> = {};
  private _limit: number | undefined;
  private _sort: Partial<Record<FlatKey<T>, 'asc' | 'desc'>> = {};
  private _select: FlatKey<T>[] = [];

  where<K extends FlatKey<T>>(field: K, condition: FieldCondition): this {
    this.query[field] = condition;
    return this;
  }

  and(queries: QueryObject<T>[]): this {
    this.query['$and'] = queries;
    return this;
  }

  or(queries: QueryObject<T>[]): this {
    this.query['$or'] = queries;
    return this;
  }

  custom(fn: (doc: T) => boolean): this {
    this.query['$where'] = fn;
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  sort(field: FlatKey<T>, direction: 'asc' | 'desc'): this {
    this._sort[field] = direction;
    return this;
  }

  select(...fields: FlatKey<T>[]): this {
    this._select = fields;
    return this;
  }

  build(): QueryObject<T> {
    return this.query;
  }

  filter(data: T[]): Partial<T>[] {
    let result = filterData(data, this.query);

    for (const [key, dir] of Object.entries(this._sort)) {
      result = result.sort((a, b) => {
        const aVal = getNestedValue(a, key as FlatKey<T>);
        const bVal = getNestedValue(b, key as FlatKey<T>);
        return dir === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    if (this._limit !== undefined) {
      result = result.slice(0, this._limit);
    }

    if (this._select.length > 0) {
      return result.map(item => {
        const selected: Partial<T> = {};
        for (const key of this._select) {
          selected[key.split('.')[0] as keyof T] = getNestedValue(item, key);
        }
        return selected;
      });
    }

    return result;
  }
}
