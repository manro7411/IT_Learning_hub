import { useState } from 'react';
import Calendar, { type CalendarProps } from 'react-calendar';
import './CalendarWidget.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarWidget = () => {
  const [value, setValue] = useState<Value>(new Date());

  const handleChange: CalendarProps['onChange'] = (nextValue) => {
    setValue(nextValue);
  };

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
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;
          return isSunday || isSaturday ? 'weekend' : null;
        }}
      />
  );
};

export default CalendarWidget;
