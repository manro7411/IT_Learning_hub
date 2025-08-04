interface Reminder {
  id: string;
  title: string;
  dueDate: string | Date;
}

interface ReminderBoxProps {
  title?: string;
  reminders: Reminder[];
  accentColor?: string;
  onReminderClick?: (id: string) => void; 
}

const ReminderBox = ({
  title = "🔔 Reminders",
  reminders,
  accentColor = "text-red-600",
  onReminderClick,
}: ReminderBoxProps) => {
  if (reminders.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className={`text-lg font-bold ${accentColor}`}>{title}</h2>
      <ul className="space-y-1">
        {reminders.map((reminder, index) => (
          <li
            key={`${reminder.title}-${index}`}
            className={`text-sm text-gray-700 ${onReminderClick ? "cursor-pointer hover:underline" : ""}`}
            onClick={() => onReminderClick?.(reminder.id)} // <-- call callback with id
          >
            <span className="font-medium">{reminder.title}</span> –{" "}
            <span className="text-gray-500">
              {new Date(reminder.dueDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ReminderBox;