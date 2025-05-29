export function getEnumValueByString<T extends Record<string, string>>(
  enumObj: T,
  value: string
): T[keyof T] | undefined {
  const entry = Object.entries(enumObj).find(([_, v]) => v === value);
  return entry ? (entry[1] as T[keyof T]) : undefined;
}
