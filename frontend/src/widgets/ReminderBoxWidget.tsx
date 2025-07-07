interface Reminder {
  title: string;
  dueDate: string;
}

const ReminderBox = ({ reminders }: { reminders: Reminder[] }) => {
  if (reminders.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-2">
      <h2 className="text-lg font-bold text-red-600">🔔 Upcoming Deadlines</h2>
      <ul className="space-y-1">
        {reminders.map((reminder, index) => (
          <li key={`${reminder.title}-${index}`} className="text-sm text-gray-700">
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
