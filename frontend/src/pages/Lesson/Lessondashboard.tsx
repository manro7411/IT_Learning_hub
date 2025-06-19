import { useEffect, useState } from 'react';
import axios from 'axios';

import CalendarWidget from '../../widgets/CalendarWidget';
import ScoreboardChart from '../../components/ScoreboardChart';
import Sidebar from '../../widgets/SidebarWidget';

interface Lesson {
  id: number;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  author?: string;
}

const LessonPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
        .get('http://localhost:8080/learning')
        .then((res) => setLessons(res.data))
        .catch((err) => {
          console.error("❌ Failed to fetch lessons:", err);
          alert("Failed to fetch lessons");
        })
        .finally(() => setLoading(false));
  }, []);

  return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Lessons Grid */}
            <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 order-2 xl:order-1">
              {loading ? (
                  <div className="text-gray-500">Loading lessons...</div>
              ) : lessons.length === 0 ? (
                  <div className="text-gray-500">No lessons available</div>
              ) : (
                  lessons.map((lesson) => (
                      <div key={lesson.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                        <img
                            src={lesson.thumbnailUrl || '/placeholder.png'}
                            alt={lesson.title}
                            className="w-full h-36 object-cover"
                        />
                        <div className="p-4">
                    <span className="text-xs text-purple-600 font-semibold uppercase">
                      {lesson.category}
                    </span>
                          <h3 className="text-sm font-semibold mt-1">{lesson.title}</h3>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full" />
                            <div>
                              <div className="text-sm font-medium">{lesson.author || "Unknown Author"}</div>
                              <div className="text-xs text-gray-500">Learning Content</div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ))
              )}
            </div>

            {/* Calendar and Scoreboard */}
            <div className="order-1 xl:order-2 space-y-6">
              <CalendarWidget />
              <ScoreboardChart />
            </div>
          </div>
        </main>
      </div>
  );
};

export default LessonPage;
