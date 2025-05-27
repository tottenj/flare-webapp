'use client';
import { HTMLAttributes, useCallback } from 'react';
import { CalendarDay, DayPicker, Modifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './calendar.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlainEvent } from '@/lib/classes/event/Event';

//TO DO - Write TESTs

type CustomDayProps = {
  day: CalendarDay;
  modifiers: Modifiers;
  eventColors: string[];
} & HTMLAttributes<HTMLDivElement>;


interface fullPageCalendarProps {
  events: PlainEvent[];
}

export default function FullPageCalendar({ events }: fullPageCalendarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()


  const eventMap: Record<string, string[]> = events.reduce(
    (acc, event) => {
      const dateKey = new Date(event.startDate).toISOString().split('T')[0];
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


  const createQueryString = useCallback((name:string, value:string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value)
        return params.toString()
    },[searchParams]
  )

 

  function CustomDay({ day, modifiers, className, eventColors, ...props }: CustomDayProps) {
    return (
      <td
        onClick={() =>
          router.push(
            pathname + '?' + createQueryString('date', day.date.toISOString().split('T')[0])
          )
        }
      >
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




  return (
      
    <div className={styles.calendarWrapper}>
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
    </div>
  );
}
