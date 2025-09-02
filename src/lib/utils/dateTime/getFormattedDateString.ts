export default function getFormattedDateString(date: Date) {
 return date.toLocaleDateString('en-US', {
    weekday: 'short', // Tue
    month: 'long', // June
    day: 'numeric', // 19
    year: 'numeric', // 2025
  });
}
