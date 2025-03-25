export type Join<K, P> = K extends string | number ? P extends string | number ? `${K}.${P}` : never : never;

export type FlatKey<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? T[K] extends Array<any>
      ? K
      : K | Join<K, FlatKey<T[K]>>
    : K
}[keyof T & (string | number)];

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
