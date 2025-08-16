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

const StatisticsChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let didCancel = false;

    const fetchProgress = async (retry = true) => {
      try {
        const res = await fetch('/api/user/progress', {
          method: 'GET',
          credentials: 'include', // ✅ send cookies
          headers: { 'Accept': 'application/json' },
        });

        if (res.status === 401 && retry) {
          // try to refresh then retry once
          const refreshRes = await fetch('/api/token/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          if (refreshRes.ok) {
            return fetchProgress(false); // retry once after refresh
          }
        }

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Fetch failed (${res.status}): ${text}`);
        }

        const result: UserCourseProgress[] = await res.json();

        if (didCancel) return;

        const transformed: ChartData[] = result.map(item => ({
          name: item.lessonTitle || 'Untitled',
          percent: item.percent,
          score: item.score,
        }));

        setData(transformed);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (didCancel) return;
        console.error(err);
        setError('Failed to load progress data.');
        setLoading(false);
      }
    };

    fetchProgress();

    return () => {
      didCancel = true;
    };
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md w-full">
      <h2 className="font-semibold text-gray-700 mb-4">Progress per Lesson</h2>

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
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
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-gray-500">No data yet.</div>
      )}
    </div>
  );
};

export default StatisticsChart;
