export default function isUsersAccount(source?: string, target?: string): boolean {
  return Boolean(source && target && source === target);
}
