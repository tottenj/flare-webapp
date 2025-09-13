export default function getEnumValueFromKey<T extends Record<string, string | number>>(
  enumObj: T,
  key: keyof T
): T[keyof T] | undefined {
  return enumObj[key];
}
