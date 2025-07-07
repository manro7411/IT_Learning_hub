import { useState, useMemo } from 'react';
import Calendar, { type CalendarProps } from 'react-calendar';
import './CalendarWidget.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  title: string;
  date: string; // ISO string
  id: string;
}

interface CalendarWidgetProps {
  events: Event[];
}

const CalendarWidget = ({ events }: CalendarWidgetProps) => {
  const [value, setValue] = useState<Value>(new Date());

  const handleChange: CalendarProps['onChange'] = (nextValue) => {
    setValue(nextValue);
  };

  // ✅ แปลงเป็น Set เพื่อ lookup เร็วขึ้น
  const eventDates = useMemo(() => {
    return new Set(events.map(e => new Date(e.date).toDateString()));
  }, [events]);

  return (
    <Calendar
      onChange={handleChange}
      value={value}
      className="react-calendar"
      prevLabel="‹"
      nextLabel="›"
      formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()}
      showNavigation={true}
      tileClassName={({ date }) => {
        const isEvent = eventDates.has(date.toDateString());
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return isEvent ? 'event-day' : isWeekend ? 'weekend' : undefined;
      }}
    />
  );
};

export default CalendarWidget;
