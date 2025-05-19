'use client';
import { HTMLAttributes } from 'react';
import { CalendarDay, DayPicker, Modifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './calendar.module.css';

//TO DO - Write TESTs

type CustomDayProps = {
  day: CalendarDay;
  modifiers: Modifiers;
  eventColors: string[];
} & HTMLAttributes<HTMLDivElement>;

function CustomDay({ day, modifiers, className, eventColors, ...props }: CustomDayProps) {
  return (
    <td>
      <div {...props} className={className}>
        <div className={styles.dayCell}>
          {day.date.getDate()}
          {eventColors.length > 0 && (
            <div className={styles.dotContainer}>
              {Object.entries(
                eventColors.reduce<Record<string, number>>((acc, color) => {
                  acc[color] = (acc[color] || 0) + 1;
                  return acc;
                }, {})
              ).map(([color, count], index) => (
                <span
                  key={index}
                  className={styles.dot}
                  style={{ backgroundColor: color }}
                  title={`${count} event${count > 1 ? 's' : ''} of this type`}
                >
                  {count > 1 && <span className={styles.dotCount}>{count}</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </td>
  );
}

interface fullPageCalendarProps {
  events: CalendarEvent[];
}

export default function FullPageCalendar({ events }: fullPageCalendarProps) {
  const eventMap: Record<string, string[]> = events.reduce(
    (acc, event) => {
      const dateKey = new Date(event.date).toISOString().split('T')[0];
      const color = event.type; // This is already an OKLCH color string
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(color);
      return acc;
    },
    {} as Record<string, string[]>
  );

  function isEventDay(day: Date): string[] {
    const key = day.toISOString().split('T')[0];
    return eventMap[key] || [];
  }

  return (
    <main className={styles.calendarWrapper}>
      <DayPicker
        mode="single"
        showOutsideDays
        weekStartsOn={0} // Optional: Start week on Sunday
        formatters={{
          formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'short' }),
        }}
        modifiers={{ hasEvent: (day) => isEventDay(day).length > 0 }}
        modifiersClassNames={{ hasEvent: styles.hasEvent }}
        classNames={{ day: styles.day }}
        components={{
          Day: ({ day, modifiers, ...props }) => (
            <CustomDay
              day={day}
              modifiers={modifiers}
              {...props}
              eventColors={isEventDay(day.date)}
            />
          ),
        }}
      />
    </main>
  );
}
