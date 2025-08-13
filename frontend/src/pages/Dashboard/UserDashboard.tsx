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
import { Navigate, useNavigate } from "react-router-dom";
import JointeamWidget from "../../widgets/JointeamWidget";
import Userwidget from "../../widgets/UserAvatarWidget";

interface Lesson {
  id: string;
  title: string;
  dueDate?: string;
  assignType: string;
}

interface Reminder {
  id: string;
  title: string;
  dueDate: string;
}

const UserDashboard = () => {
  const { user, token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignTypeFilter, setAssignTypeFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchLessons = async () => {
      try {
        const res = await axios.get("/api/learning/upcoming-due", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(res.data);
      } catch (err) {
        console.error("❌ Error fetching lessons", err);
      }
    };

    fetchLessons();
  }, [token]);



  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) =>
      assignTypeFilter === "all-types" ? true : lesson.assignType === assignTypeFilter
    );
  }, [lessons, assignTypeFilter]);

  const calendarEvents = useMemo(() => {
    return filteredLessons
      .filter((lesson) => lesson.dueDate)
      .map((lesson) => ({
        title: lesson.title,
        date: lesson.dueDate!,
        id: lesson.id,
        assignType: lesson.assignType,
      }));
  }, [filteredLessons]);

const pastDueLessons: Reminder[] = useMemo(() => {
  return calendarEvents
    .filter((e) => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((e) => ({ id:e.id, title: e.title, dueDate: e.date }))
    .slice(0, 5);
}, [calendarEvents]);

const upcomingReminders: Reminder[] = useMemo(() => {
  return calendarEvents
    .filter((e) => {
      const now = new Date();
      const duedate = new Date(e.date);

      now.setHours(0, 0, 0, 0);
      duedate.setHours(0, 0, 0, 0);
      return duedate > now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((e) => ({ id:e.id,title: e.title, dueDate: e.date }))
    .slice(0, 5);
}, [calendarEvents]);

const handleReminderClick = (id:string) =>{
  navigate(`/lesson/${id}`)
}



  if (!token) return <Navigate to="/" replace />;

  const displayName = user?.name || user?.upn || "User";

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarWidget />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {displayName}</h1>
            <div className="flex items-center space-x-4">
            <NotificationWidget />
            <Userwidget/>
            </div>
          
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <OnlineCourseBanner />
              <StatisticsChart />
              <TopViewedLessonsWidget />
              <JointeamWidget />
            </div>
            <div className="order-1 xl:order-2">
              <div className="space-y-6 mt-4 xl:mt-0">
                <div className="flex space-x-2">
                  {["all", "team", "specific"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAssignTypeFilter(type)}
                      className={`px-3 py-1 rounded-md text-sm capitalize ${
                        assignTypeFilter === type
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {type === "all-types" ? "All Types" : type}
                    </button>
                  ))}
              </div>
                <CalendarWidget events={calendarEvents} />
                <ReminderBox title="🔔 Upcoming Due Lesson" reminders={upcomingReminders} accentColor="text-blue-600"  onReminderClick={handleReminderClick}/>
                <ReminderBox title="⏰ Past Due Lessons" reminders={pastDueLessons} accentColor="text-red-600" onReminderClick={handleReminderClick}/>

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