export default function getFormattedDateString(date: Date) {
  const formattedDateString = date.toLocaleDateString('en-US', {
    weekday: 'short', // Tue
    month: 'long', // June
    day: 'numeric', // 19
    year: 'numeric', // 2025
  });

  const formattedTimeString = date.toLocaleTimeString()

  return {formattedDateString, formattedTimeString}
}
