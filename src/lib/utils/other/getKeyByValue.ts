export default function getKeyByValue<T extends Record<string, string>>(
  obj: T,
  value: string
): keyof T | undefined {
  return (Object.entries(obj) as [keyof T, string][]).find(([_, v]) => v === value)?.[0];
}
