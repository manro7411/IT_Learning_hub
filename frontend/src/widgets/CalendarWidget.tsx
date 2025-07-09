import { useState } from 'react';
import Calendar, { type CalendarProps } from 'react-calendar';
import './CalendarWidget.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Event {
  title: string;
  date: string;
  id: string;
  assignType: string; // เพิ่ม assignType
}

interface CalendarWidgetProps {
  events: Event[];
}

const CalendarWidget = ({ events }: CalendarWidgetProps) => {
  const [value, setValue] = useState<Value>(new Date());

  const handleChange: CalendarProps['onChange'] = (nextValue) => {
    setValue(nextValue);
  };

  const eventMap = events.reduce<Record<string, Event>>((acc, e) => {
    acc[new Date(e.date).toDateString()] = e;
    return acc;
  }, {});

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
        const event = eventMap[date.toDateString()];
        if (event) {
          switch (event.assignType) {
            case 'all':
              return 'event-all';
            case 'team':
              return 'event-team';
            case 'specific':
              return 'event-specific';
            default:
              return 'event-day';
          }
        }
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        return isWeekend ? 'weekend' : undefined;
      }}
    />
  );
};

export default CalendarWidget;
