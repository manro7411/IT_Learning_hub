import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
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

const defaultData: ChartData[] = [
  { name: 'Lesson 1', percent: 20, score: 5 },
  { name: 'Lesson 2', percent: 40, score: 8 },
  { name: 'Lesson 3', percent: 60, score: 12 }
];

const StatisticsChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch('/api/user/progress', {
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
        setData(transformed.length > 0 ? transformed : defaultData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load progress data.");
        setData(defaultData);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) {
    return (
      <div className="text-red-500">
        Failed to load progress data. Please try again later.
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md w-full">
      <h2 className="font-semibold text-gray-700 mb-4">Progress per Lesson</h2>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" minTickGap={20} />
            <YAxis yAxisId="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip />
            <Legend />

            <Area
              yAxisId="left"
              type="monotone"
              dataKey="percent"
              stroke="#6366f1"
              fill="#6366f133"
              strokeWidth={2}
              animationDuration={800}
              name="Progress (%)"
            />

            <Area
              yAxisId="right"
              type="monotone"
              dataKey="score"
              stroke="#f97316"
              fill="#f9731633"
              strokeWidth={2}
              animationDuration={800}
              name="Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No progress data available.</p>
      )}
    </div>
  );
};

export default StatisticsChart;