'use client';
import { HTMLAttributes, useCallback } from 'react';
import { CalendarDay, DayPicker, Modifiers } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './calendar.module.css';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PlainEvent } from '@/lib/classes/event/Event';
import getKeyByValue from '@/lib/utils/enumFunctions/getKeyByValue';
import eventType from '@/lib/enums/eventType';
import { toLocalDateKey } from '@/lib/utils/dateTime/toLocaleDateString';

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

  const eventMap: Record<string, string[]> = events.reduce(
    (acc, event) => {
      const dateKey = toLocalDateKey(event.startDate);
      const color = event.type; // This is already an OKLCH color string
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(color);
      return acc;
    },
    {} as Record<string, string[]>
  );

  function isEventDay(day: Date): string[] {
    const key = toLocalDateKey(day);
    return eventMap[key] || [];
  }

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
                ).map(([color, count], index) => (
                  <span
                    key={index}
                    className={styles.dot}
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const params = new URLSearchParams(searchParams.toString());

                      const clickedType = getKeyByValue(eventType, color);
                      const currentType = params.get('type');

                      const newDate = toLocalDateKey(day.date);
                      params.set('date', newDate);

                      if (clickedType) {
                        // Get existing types as array
                        const currentTypesStr = params.get('type') || '';
                        const currentTypes = currentTypesStr ? currentTypesStr.split(',') : [];

                        if (clickedType && !currentTypes.includes(clickedType)) {
                          currentTypes.push(clickedType);
                          params.set('type', currentTypes.join(','));
                          router.push(`${pathname}?${params.toString()}`);
                        }
                      }

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
          hasEvent: (day) => isEventDay(day).length > 0,
          selected: (day) =>
            selectedDate instanceof Date &&
            !isNaN(selectedDate.getTime()) &&
            toLocalDateKey(day) === toLocalDateKey(selectedDate),
        }}
        modifiersClassNames={{ hasEvent: styles.hasEvent, selected: styles.selectedDay }}
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
