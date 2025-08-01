import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface UserCourseProgress {
  lessonId: string;
  lessonTitle: string;
  percent: number;
  score: number;
  attemps: number;
  maxAttemps: number;
  userEmail: string;
}

interface ChartData {
  name: string;
  percent: number;
  score: number;
}

const StatisticsChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch('http://localhost:8080/user/progress', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed (${res.status}): ${text}`);
        }
        return res.json();
      })
      .then((result: UserCourseProgress[]) => {
        const transformed: ChartData[] = result.map(item => ({
          name: item.lessonTitle || 'Untitled',
          percent: item.percent,
          score: item.score
        }));
        setData(transformed);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load progress data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md w-full">
      <h2 className="font-semibold text-gray-700 mb-4">Progress per Lesson</h2>
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
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="percent"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="score"
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
