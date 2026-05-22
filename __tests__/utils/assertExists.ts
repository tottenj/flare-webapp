export default function assertExists<T>(value: T | null | undefined): T {
  if (value == null) throw new Error('Expected value to exist');
  return value;
}
