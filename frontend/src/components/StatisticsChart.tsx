import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface UserCourseProgress {
  lessonId: string;
  lessonTitle: string;
  percent: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  userEmail: string;
}

interface ChartData {
  name: string;
  percent: number;
  score: number;
}

const UserProgressChart = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

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
        console.error("Error loading progress:", err);
        setError("Failed to load progress data.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md w-full">
      <h2 className="font-semibold text-gray-700 mb-4">Progress per Lesson</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && data.length === 0 && (
        <p className="text-gray-500">No progress data yet.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" minTickGap={20} />

            {/* แกนซ้ายสำหรับ Progress */}
            <YAxis yAxisId="left" domain={[0, 100]} />

            {/* แกนขวาสำหรับ Score */}
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
    </div>
  );
};

export default UserProgressChart;
