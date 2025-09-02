export default function getMonthRangeFromDate(date: Date) {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
}
