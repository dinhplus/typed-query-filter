import { FlatKey } from './flatKey';

export function getNestedValue<T, K extends FlatKey<T>>(obj: T, path: K): any {
  return path.toString().split('.').reduce((acc, key) => acc?.[key], obj as any);
}
