import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import clsx from 'clsx';

const data = [
  { name: 'K', score: 200, avatar: 'K' },
  { name: 'P', score: 220, avatar: 'P' },
  { name: 'C', score: 160, avatar: 'https://i.pravatar.cc/100?u=c' },
  { name: 'J', score: 80, avatar: 'https://i.pravatar.cc/100?u=j' },
  { name: 'A', score: 150, avatar: 'https://i.pravatar.cc/100?u=a' },
  { name: 'M', score: 190, avatar: 'https://i.pravatar.cc/100?u=m' },
];

const ScoreboardChart = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Score board</h2>
        <select className="text-sm bg-transparent focus:outline-none">
          <option>Month</option>
          <option>Week</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#6366f1">
            {data.map((_, index) => (
              <Cell key={index} fill="#6366f1" />
            ))}
          </Bar>
          <XAxis dataKey="name" tick={false} axisLine={false} />
        </BarChart>
      </ResponsiveContainer>

      <div className="flex justify-around items-center mt-2">
        {data.map((user, index) => (
          <div key={index} className="flex flex-col items-center text-xs">
            {user.avatar.startsWith('http') ? (
              <img
                src={user.avatar}
                className="w-6 h-6 rounded-full object-cover"
                alt={user.name}
              />
            ) : (
              <div className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center font-bold text-white',
                index === 0 ? 'bg-purple-500' : 'bg-pink-500'
              )}>
                {user.avatar}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreboardChart;
