export default function deepMerge<T>(base: T, override?: Partial<T>): T {
  if (!override) return base;

  const output: any = { ...base };

  for (const key in override) {
    const value = override[key];

    const isPlainObject =
      value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

    if (isPlainObject) {
      output[key] = deepMerge((base as any)[key] ?? {}, value);
    } else {
      output[key] = value;
    }
  }

  return output;
}
