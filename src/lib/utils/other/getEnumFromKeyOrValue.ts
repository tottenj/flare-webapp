export default function getEnumValuesFromString<T extends Record<string, string>>(
  enumObj: T,
  input: string
): T[keyof T][] {
  const parts = input.split(',').map((p) => p.trim());

  return parts
    .map((part) => {
      // Convert enum key to value
      if (part in enumObj) {
        return enumObj[part as keyof T];
      }

      // Check if it's a value directly
      const match = (Object.keys(enumObj) as (keyof T)[]).find((key) => enumObj[key] === part);
      return match ? enumObj[match] : undefined;
    })
    .filter((v): v is T[keyof T] => v !== undefined);
}
