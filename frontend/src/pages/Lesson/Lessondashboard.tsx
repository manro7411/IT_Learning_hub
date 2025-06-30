import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../Authentication/AuthContext";
import CalendarWidget from "../../widgets/CalendarWidget";
import ScoreboardChart from "../../components/ScoreboardChart";
import Sidebar from "../../widgets/SidebarWidget";
import defaultUserAvatar from "../../assets/user.png";

interface Lesson {
  id: string;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
}

interface Progress {
  percent: number;
  lastTimestamp: number;
}

const LessonPage = () => {
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");

  const navigate = useNavigate();
  const location = useLocation();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchLessonsAndProgress = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          axios.get("http://localhost:8080/learning", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8080/user/progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLessons(lessonsRes.data);

        const map: Record<string, Progress> = {};
        progressRes.data.forEach((item: { lessonId: string; percent: number; lastTimestamp?: number }) => {
          const key = item.lessonId?.toString().trim().toLowerCase();
          map[key] = {
            percent: item.percent,
            lastTimestamp: item.lastTimestamp || 0,
          };
        });
        setProgressMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
        alert("Failed to load lessons or progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsAndProgress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, location.pathname]);

  const handleLessonClick = async (id: string) => {
    const key = id?.toString().trim().toLowerCase();
    const lastTimestamp = progressMap[key]?.lastTimestamp || 0;

    try {
      await axios.post(`http://localhost:8080/learning/${id}/click`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Failed to log click:", err);
    } finally {
      navigate(`/lesson/${id}`, { state: { lastTimestamp } });
    }
  };

  const filtered = lessons.filter((l) =>
    [l.title, l.category, l.description ?? ""].some((v) =>
      v.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full xl:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
            {loading ? (
              <div className="text-gray-500">Loading lessons…</div>
            ) : filtered.length === 0 ? (
              <div className="text-gray-500">No lessons found</div>
            ) : (
              filtered.map((lesson) => {
                const key = lesson.id?.toString().trim().toLowerCase();
                const progress = progressMap[key] ?? { percent: 0, lastTimestamp: 0 };

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <div className="w-64 h-[300px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                      <div className="w-full h-32 bg-gray-100">
                        <img
                          src={lesson.thumbnailUrl || "/placeholder.png"}
                          alt={lesson.title}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png";
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <span className="text-[10px] font-semibold uppercase text-purple-600">
                          {lesson.category}
                        </span>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                          {lesson.title}
                        </h3>

                        <div className="mb-2 mt-3 h-1 rounded-full bg-gray-200">
                          <div
                            className="h-full transition-all duration-300 rounded-full bg-blue-500"
                            style={{
                              width: `${Math.max(progress.percent, 1)}%`,
                              minWidth: progress.percent > 0 ? 4 : 0,
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 mb-1">
                          Progress: {progress.percent}%
                        </div>

                        <div className="mt-auto flex items-center space-x-2">
                          <img
                            src={lesson.authorAvatarUrl || defaultUserAvatar}
                            alt="Author"
                            onError={(e) => {
                              e.currentTarget.src = defaultUserAvatar;
                            }}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-medium">
                              {lesson.authorName || "Unknown Author"}
                            </div>
                            <div className="text-[10px] text-gray-500">Learning Content</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="order-1 space-y-6 xl:order-2">
            <CalendarWidget />
            <ScoreboardChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonPage;
