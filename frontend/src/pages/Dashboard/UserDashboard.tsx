import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Authentication/AuthContext";

import CalendarWidget from "../../widgets/CalendarWidget";
import SidebarWidget from "../../widgets/SidebarWidget";
import ScoreboardChart from "../../components/ScoreboardChart";
import StatisticsChart from "../../components/StatisticsChart";
import OnlineCourseBanner from "../../components/OnlineCourseBanner";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget"; // ✅ chatbot

interface TopLesson {
  id: string;
  title: string;
  category: string;
  thumbnailUrl?: string;
  viewers?: number; // 👁 optional: backend สามารถใส่ได้
}

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const displayName = user?.name || user?.upn;

  const [topLessons, setTopLessons] = useState<TopLesson[]>([]);

  useEffect(() => {
    axios
        .get("http://localhost:8080/learning/top-viewed")
        .then((res) => setTopLessons(res.data))
        .catch(console.error);
  }, []);

  return (
      <>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <SidebarWidget />

          {/* Main Content */}
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              👋 Welcome, {displayName}
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Central Content (3/4 width) */}
              <div className="xl:col-span-3 space-y-6">
                <OnlineCourseBanner />
                <StatisticsChart />

                {/* 🔥 Top Viewed Lessons */}
                <section>
                  <h2 className="text-xl font-semibold mb-3">
                    🔥 Most Viewed Lessons
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topLessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            className="p-4 bg-white rounded-xl shadow hover:shadow-md border border-gray-100"
                        >
                          <h3 className="text-lg font-bold text-gray-800">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-1">
                            {lesson.category}
                          </p>
                          {lesson.viewers !== undefined && (
                              <p className="text-xs text-blue-600">
                                👁 {lesson.viewers} viewers
                              </p>
                          )}
                        </div>
                    ))}
                  </div>
                </section>

                {/* Example cards: Agile/Scrum/Waterfall */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Agile", "Scrum", "Waterfall"].map((title, i) => (
                      <div
                          key={i}
                          className="bg-white p-4 rounded-xl shadow-md"
                      >
                        <div className="text-sm text-purple-600 font-medium mb-2">
                          {title}
                        </div>
                        <div className="text-lg font-semibold">
                          {title} Methodologies Overview
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full" />
                          <div>
                            <div className="text-sm font-medium">{displayName}</div>
                            <div className="text-xs text-gray-500">Software Developer</div>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* Calendar and Scoreboard */}
              <div className="order-1 xl:order-2">
                <div className="space-y-6 mt-4 xl:mt-0">
                  <CalendarWidget />
                  <ScoreboardChart />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* ✅ Floating Chatbot */}
        <ChatBubbleWidget />
      </>
  );
};

export default UserDashboard;
