export default function searchParamDate(dateParam: string | string[] | undefined) {
  const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)); // avoid timezone shift
}
