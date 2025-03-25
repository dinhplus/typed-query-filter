export type Join<K, P> = K extends string | number ? P extends string | number ? `${K}.${P}` : never : never;

type Prev = [never, 0, 1, 2, 3, 4, 5];

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

export function getFlatKeys<T>(obj: T, prefix = ''): FlatKey<T>[] {
  const keys: FlatKey<T>[] = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = (obj as any)[key];
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys.push(...getFlatKeys(val, fullKey) as FlatKey<T>[]);
    } else {
      keys.push(fullKey as FlatKey<T>);
    }
  }
  return keys;
}
