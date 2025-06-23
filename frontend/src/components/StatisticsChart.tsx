import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { date: '1 Oct', overview: 1800, overall: 800 },
  { date: '3 Oct', overview: 2600, overall: 1200 },
  { date: '7 Oct', overview: 2200, overall: 1400 },
  { date: '10 Oct', overview: 3000, overall: 1000 },
  { date: '14 Oct', overview: 4000, overall: 2800 },
  { date: '20 Oct', overview: 1900, overall: 3600 },
  { date: '23 Oct', overview: 1200, overall: 3200 },
  { date: '27 Oct', overview: 2100, overall: 3400 },
  { date: '30 Oct', overview: 3900, overall: 2600 },
];

const StatisticsChart = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-700">Statistics</h2>
        <div className="flex space-x-2 text-sm">
          <button className="px-2 py-1 text-gray-500">Day</button>
          <button className="px-2 py-1 text-gray-500">Week</button>
          <button className="px-2 py-1 bg-orange-500 text-white rounded-md">Month</button>
          <button className="px-2 py-1 text-gray-500">Year</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="overview"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="overall"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticsChart;