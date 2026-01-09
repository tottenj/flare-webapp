'use client';
import { HTMLAttributes, useCallback } from 'react';
import { CalendarDay, DayPicker, Modifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './calendar.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toLocalDateKey } from '@/lib/utils/dateTime/toLocaleDateString';


type CustomDayProps = {
  day: CalendarDay;
  modifiers: Modifiers;
  eventColors: string[];
} & HTMLAttributes<HTMLDivElement>;



export default function FullPageCalendar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // local midnight
  }

  const selectedDate = searchParams.get('date')
    ? parseLocalDate(searchParams.get('date')!)
    : undefined;

 

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function CustomDay({ day, modifiers, className, eventColors, ...props }: CustomDayProps) {
    return (
      <td
        onClick={() => {
          const currentDate = searchParams.get('date');
          const newDate = day.date.toISOString().slice(0, 10);

          if (currentDate === newDate) return;

          router.push(pathname + '?' + createQueryString('date', newDate));
        }}
      >
        <div {...props} className={className}>
          <div className={styles.dayCell}>
            {day.date.getDate()}
            {eventColors.length > 0 && (
              <div className={styles.dotContainer}>
                {Object.entries(
                  eventColors.reduce<Record<string, number>>((acc, color) => {
                    acc[color] = acc[color] || 0;
                    return acc;
                  }, {})
                ).map(([color, count]:any, index) => (
                  <span
                    key={index}
                    className={styles.dot}
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams(searchParams.toString());

            
                      const currentType = params.get('type');

                      const newDate = toLocalDateKey(day.date);
                      params.set('date', newDate);

                     

                      router.push(`${pathname}?${params.toString()}`);
                    }}
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
        modifiers={{
         
          selected: (day) =>
            selectedDate instanceof Date &&
            !isNaN(selectedDate.getTime()) &&
            toLocalDateKey(day) === toLocalDateKey(selectedDate),
        }}
        modifiersClassNames={{ hasEvent: styles.hasEvent, selected: styles.selectedDay }}
        classNames={{ day: styles.day }}
       
      />
    </div>
  );
}
