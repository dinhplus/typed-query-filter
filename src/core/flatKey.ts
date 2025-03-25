// FlatKey<T> with recursion depth limitation
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export type FlatKey<T, D extends number = 3> = [D] extends [never]
  ? never
  : T extends object
  ? {
    [K in keyof T & (string | number)]: T[K] extends Array<any>
    ? `${K}`
    : T[K] extends object
    ? `${K}` | `${K}.${FlatKey<T[K], Prev[D]>}`
    : `${K}`
  }[keyof T & (string | number)]
  : never;

export function getFlatKeys<T>(obj: T, prefix = '', depth: number = 3): FlatKey<T>[] {
  const keys: string[] = [];

  if (depth <= 0) return [];

  for (const key in obj) {
    const val = (obj as any)[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys.push(fullKey);
      keys.push(...getFlatKeys(val, fullKey, depth - 1));
    } else {
      keys.push(fullKey);
    }
  }

  return keys as FlatKey<T>[];
}
