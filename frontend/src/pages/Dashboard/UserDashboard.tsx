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
import { useLesson } from "../Lesson/hooks/useLessons";
import OverallProgressWidget from "../../widgets/OverallProgressWidget";
import CourseProgressTable from "../../widgets/CourseProgressTable";

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
  const {progressMap, progressRes, } = useLesson(token, location.pathname);
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = calendarEvents.filter((event) => {
    const dueDate = new Date(event.date);
    dueDate.setHours(0, 0, 0, 0);

    const progress = progressMap[event.id.toLowerCase()]?.percent || 0;

    return dueDate > today && progress < 100;
  });

  const sortedEvents = filteredEvents.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const reminders = sortedEvents.map((event) => ({
    id: event.id,
    title: event.title,
    dueDate: event.date,
  }));

  return reminders.slice(0, 5);
}, [calendarEvents]);

const overallProgress = useMemo(() => {
  if (lessons.length === 0) return 0;

  const totalProgress = lessons.reduce((sum, lesson) => {
    const key = lesson.id.toLowerCase();
    const progress = progressMap[key]?.percent || 0;
    return sum + progress;
  }, 0);

  return Math.round(totalProgress / lessons.length); // Average progress
}, [lessons, progressMap]);

function formatDate(isoString: string | number | Date) {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(',', '.');
}

  const courses = useMemo(() => {
    return progressRes.map((item) => ({
      id:item.lessonId,
      title: item.lessonTitle || "Unknown Title",
      status:
        item.percent === 100
          ? "Completed"
          : item.percent > 0
          ? "In Progress"
          : "Not Started",
      progress: item.percent,
      startDate: formatDate(item.updatedAt) || "", 
      dueDate: item.dueDate ? formatDate(item.dueDate) : "empty", 
    }));
  }, [progressRes]);
  

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
              <CourseProgressTable courses={courses} /> 

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
                <OverallProgressWidget progress={overallProgress} />
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