import { FieldCondition, QueryObject } from './types';
import { FlatKey } from './core/flatKey';
import { getNestedValue } from './core/getNestedValue';
import { filterData } from './filterData';

export class QueryBuilder<T extends object> {
  private query: QueryObject<T> = {};
  private _limit: number | undefined;
  private _sort: Record<string, 'asc' | 'desc'> = {};
  private _select: FlatKey<T>[] | ((item: T) => any) | Record<string, any> = [];

  where<K extends FlatKey<T>>(field: K, condition: FieldCondition): this {
    (this.query as any)[field as string] = condition;
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
    this._sort[field as string] = direction;
    return this;
  }

  select<R>(...fields: (FlatKey<T> | ((item: T) => R) | Record<string, any>)[]): this {
    if (fields.length === 1) {
      const firstArg = fields[0];

      // Case 2:  callback
      if (typeof firstArg === 'function') {
        this._select = firstArg;
        return this;
      }

      // Case 3: Template object
      if (typeof firstArg === 'object' && firstArg !== null && !Array.isArray(firstArg)) {
        this._select = firstArg;
        return this;
      }
    }

    // Case 1: List of fields
    this._select = fields as FlatKey<T>[];
    return this;
  }

  build(): QueryObject<T> {
    return this.query;
  }

  filter(data: T[]): any[] {
    let result = filterData(data, this.query);

    // Apply sorting
    for (const [key, dir] of Object.entries(this._sort)) {
      result = result.sort((a, b) => {
        // Use getNestedValue for deep path access
        const aVal = getNestedValue(a, key as any);
        const bVal = getNestedValue(b, key as any);
        
        // Handle different types of values for comparison
        if (aVal === undefined && bVal === undefined) return 0;
        if (aVal === undefined) return dir === 'asc' ? -1 : 1;
        if (bVal === undefined) return dir === 'asc' ? 1 : -1;
        
        // Compare strings case-insensitive
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return dir === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        // Compare dates
        if (aVal instanceof Date && bVal instanceof Date) {
          return dir === 'asc' 
            ? aVal.getTime() - bVal.getTime() 
            : bVal.getTime() - aVal.getTime();
        }
        
        // Default comparison for numbers and other types
        return dir === 'asc' 
          ? (aVal > bVal ? 1 : aVal < bVal ? -1 : 0) 
          : (bVal > aVal ? 1 : bVal < aVal ? -1 : 0);
      });
    }

    // Apply limit
    if (this._limit !== undefined) {
      result = result.slice(0, this._limit);
    }

    // Apply projection/selection
    if (typeof this._select === 'function') {
      // Method 2: Transform with callback function
      return result.map(item => (this._select as Function)(item));
    } else if (Array.isArray(this._select) && this._select.length > 0) {
      // Method 1: Select specific fields
      return result.map(item => {
        const selected: Partial<T> = {};
        for (const key of this._select as FlatKey<T>[]) {
          if (typeof key === 'string') {
            // For string paths, use getNestedValue to get the value
            // and attach to the top-level key or first part of the path
            if (key.includes('.')) {
              const rootKey = key.split('.')[0] as keyof T;
              let currentObj = selected;
              const parts = key.split('.');
              
              // Create nested structure
              for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i] as keyof typeof currentObj;
                if (!currentObj[part]) {
                  currentObj[part] = {} as any;
                }
                currentObj = currentObj[part] as any;
              }
              
              // Set the value at the leaf
              const lastPart = parts[parts.length - 1];
              currentObj[lastPart as keyof typeof currentObj] = getNestedValue(item, key as any);
            } else {
              selected[key as unknown as keyof T] = item[key as unknown as keyof T];
            }
          } else {
            selected[key as keyof T] = item[key as keyof T];
          }
        }
        return selected;
      });
    } else if (typeof this._select === 'object' && this._select !== null && !Array.isArray(this._select)) {
      // Method 3: Use template object
      return result.map(item => this.extractFromTemplate(item, this._select as Record<string, any>));
    }

    // If no selection/projection, return the filtered results as is
    return result;
  }

  /**
   * Extract values according to template structure
   */
  private extractFromTemplate(item: T, template: Record<string, any>): any {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(template)) {
      // Handle array with template [path, templateObj]
      if (Array.isArray(value) && value.length === 2 && 
          typeof value[0] === 'string' && 
          typeof value[1] === 'object' && value[1] !== null) {
        
        const arrayPath = value[0] as string;
        const arrayTemplate = value[1] as Record<string, any>;
        
        // Get data from path
        const arrayData = getNestedValue(item, arrayPath as any);
        
        if (Array.isArray(arrayData)) {
          // Apply template to each array element
          result[key] = arrayData.map(arrayItem => 
            this.applyTemplateToItem(arrayItem, arrayTemplate)
          );
        } else {
          result[key] = [];
        }
      }
      // Handle string paths
      else if (typeof value === 'string') {
        result[key] = getNestedValue(item, value as any);
      }
      // Handle nested objects
      else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.extractFromTemplate(item, value as Record<string, any>);
      }
      // Other types (boolean, number, null, ...)
      else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Apply template to a single item (used for array elements)
   */
  private applyTemplateToItem(item: any, template: Record<string, any>): any {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(template)) {
      if (typeof value === 'string') {
        // Get value from path
        result[key] = getNestedValue(item, value as any);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recurse for nested objects
        result[key] = this.applyTemplateToItem(item, value);
      } else if (Array.isArray(value) && value.length === 2 && 
                typeof value[0] === 'string' && 
                typeof value[1] === 'object' && value[1] !== null) {
        // Handle nested arrays
        const nestedArrayPath = value[0] as string;
        const nestedTemplate = value[1] as Record<string, any>;
        
        // Get nested array
        const nestedArray = getNestedValue(item, nestedArrayPath as any);
        
        if (Array.isArray(nestedArray)) {
          result[key] = nestedArray.map(nestedItem => 
            this.applyTemplateToItem(nestedItem, nestedTemplate)
          );
        } else {
          result[key] = [];
        }
      } else {
        // Primitive values
        result[key] = value;
      }
    }
    
    return result;
  }
}
