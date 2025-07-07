import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../Authentication/AuthContext";
import axios from "axios";

import SidebarWidget from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import StatisticsChart from "../../components/StatisticsChart";
import OnlineCourseBanner from "../../components/OnlineCourseBanner";
import TopViewedLessonsWidget from "./TopViewedLessonsWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import ReminderBox from "../../widgets/ReminderBoxWidget";
import { Navigate } from "react-router-dom";

interface Lesson {
  id: string;
  title: string;
  dueDate?: string;
  assignType: string;
}

interface Reminder {
  title: string;
  dueDate: string;
}

const UserDashboard = () => {
  const { user, token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignTypeFilter, setAssignTypeFilter] = useState<string>("all-types"); // เพิ่มตัวเลือก filter

  useEffect(() => {
    if (!token) return;

    const fetchAssignedLessons = async () => {
      try {
        const res = await axios.get("http://localhost:8080/learning/assigned-to-me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("📚 Assigned Lessons:", res.data);
        setLessons(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch assigned lessons", err);
      }
    };

    fetchAssignedLessons();
  }, [token]);

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      if (assignTypeFilter === "all-types") return true;
      return lesson.assignType === assignTypeFilter;
    });
  }, [lessons, assignTypeFilter]);

  const calendarEvents = useMemo(() => {
    return filteredLessons
      .filter((lesson) => lesson.dueDate)
      .map((lesson) => ({
        title: lesson.title,
        date: lesson.dueDate!,
        id: lesson.id,
      }));
  }, [filteredLessons]);

  const upcomingReminders: Reminder[] = useMemo(() => {
    return calendarEvents
      .filter((e) => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({ title: e.title, dueDate: e.date }))
      .slice(0, 5);
  }, [calendarEvents]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const displayName = user?.name || user?.upn || "User";

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarWidget />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              👋 Welcome, {displayName}
            </h1>
            <NotificationWidget />
          </div>

  
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <OnlineCourseBanner />
              <StatisticsChart />
              <TopViewedLessonsWidget />
            </div>
            <div className="order-1 xl:order-2">
              <div className="space-y-6 mt-4 xl:mt-0">
                <div className="flex items-center mb-6">
            <label className="text-sm mr-2">Filter:</label>
            <select
              value={assignTypeFilter}
              onChange={(e) => setAssignTypeFilter(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="all-types">All Types</option>
              <option value="all">All</option>
              <option value="team">Team</option>
              <option value="specific">Specific</option>
            </select>
          </div>
                <CalendarWidget events={calendarEvents} />
                <ReminderBox reminders={upcomingReminders} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <ChatBubbleWidget />
    </>
  );
};

export default UserDashboard;
