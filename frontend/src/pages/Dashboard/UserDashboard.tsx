// src/pages/dashboard/UserDashboard.tsx
import { useContext, useEffect, useMemo, useState } from "react";
import { http } from "../../Authentication/http";
import { AuthContext } from "../../Authentication/AuthContext";
import SidebarWidget from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import StatisticsChart from "../../components/StatisticsChart";
import OnlineCourseBanner from "../../components/OnlineCourseBanner";
import TopViewedLessonsWidget from "./TopViewedLessonsWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import ReminderBox from "../../widgets/ReminderBoxWidget";
import { useNavigate } from "react-router-dom";
import JointeamWidget from "../../widgets/JointeamWidget";
import Userwidget from "../../widgets/UserAvatarWidget";

interface Lesson {
  id: string;
  title: string;
  dueDate?: string;   // ISO string
  assignType: string; // "all" | "team" | "specific"
}
interface Reminder {
  id: string;
  title: string;
  dueDate: string;
}
type SessionInfo = {
  accessExp?: number;   // epoch seconds
  refreshExp?: number;  // epoch seconds
  sid?: string;
};

const UserDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { user, loading: authLoading } = (useContext(AuthContext) as any) || {};
  const [displayName, setDisplayName] = useState<string>(
    user?.name || user?.upn || user?.email || "User"
  );
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [assignTypeFilter, setAssignTypeFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [authorized, setAuthorized] = useState<boolean>(false);
  const navigate = useNavigate();

  // ---------- helper: preflight ตรวจว่ามี session ไหม ----------
  const preflight = async (): Promise<boolean> => {
    try {
      await http.get("/profile");         // มี jwt ใช้งานได้
      return true;
    } catch {
      try {
        await http.post("/login/refresh"); // ลองใช้ refresh
        await http.get("/profile");        // warm-up ให้แน่ใจ
        return true;
      } catch {
        return false; // ไม่มีทั้ง access และ refresh → ไม่ผ่าน
      }
    }
  };

  // ---------- โหลดข้อมูลหน้าแดชบอร์ด ----------
  const loadData = async () => {
    // 1) โปรไฟล์
    const me = await http.get("/profile");
    const name = me.data?.name || me.data?.upn || me.data?.email || "User";
    setDisplayName(name);

    // 2) งานที่จะครบกำหนด
    const res = await http.get<Lesson[]>("/learning/upcoming-due");
    setLessons(res.data ?? []);
  };

  // ---------- mount: block ถ้าไม่มี session ----------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ok = await preflight();
        if (!ok) {
          // ไม่มีทั้ง access/refresh → กลับหน้า login
          navigate("/", { replace: true });
          return;
        }
        if (!cancelled) setAuthorized(true);
        await loadData();
      } catch (e) {
        console.error("❌ Loading dashboard failed", e);
        navigate("/", { replace: true });
        return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- รีเฟรชล่วงหน้าตาม /login/session (เริ่มเฉพาะตอน authorized แล้ว) ----------
  useEffect(() => {
    if (!authorized) return;
    let timer: number | undefined;

    const schedule = async () => {
      try {
        const { data } = await http.get<SessionInfo>("/login/session");
        if (!data?.accessExp) return;

        const msToExpire = data.accessExp * 1000 - Date.now();
        const ms = Math.max(msToExpire - 60_000, 5_000); // รีเฟรชล่วงหน้า 60s

        timer = window.setTimeout(async () => {
          try {
            await http.post("/login/refresh");
          } catch (e) {
            console.warn("Silent refresh failed:", e);
            // ถ้า refresh ล้มเหลวจริง ๆ อินเตอร์เซปเตอร์/โหลดครั้งถัดไปจะพาออกเอง
          } finally {
            schedule(); // ตั้งรอบใหม่
          }
        }, ms);
      } catch (e) {
        console.warn("Fetch /login/session failed:", e);
      }
    };

    schedule();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [authorized]);

  // ---------- ensure session เมื่อโฟกัส/กลับมา visible ----------
  useEffect(() => {
    if (!authorized) return;

    const ensureSession = async () => {
      try {
        await http.get("/profile");
      } catch {
        try {
          await http.post("/login/refresh");
          await http.get("/profile");
        } catch {
          // refresh ไม่ผ่าน → ป้องกันค้างหน้าเดิม
          navigate("/", { replace: true });
        }
      }
    };
    const onFocus = () => ensureSession();
    const onVisible = () => {
      if (document.visibilityState === "visible") ensureSession();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [authorized, navigate]);

  // ---------- ฟิลเตอร์ ----------
  const filteredLessons = useMemo(() => {
    if (assignTypeFilter === "all-type") return lessons;
    return lessons.filter((l) => l.assignType === assignTypeFilter);
  }, [lessons, assignTypeFilter]);

  const calendarEvents = useMemo(() => {
    return filteredLessons
      .filter((l) => !!l.dueDate)
      .map((l) => ({ title: l.title, date: l.dueDate!, id: l.id, assignType: l.assignType }));
  }, [filteredLessons]);

  const pastDueLessons: Reminder[] = useMemo(() => {
    return calendarEvents
      .filter((e) => new Date(e.date) < new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({ id: e.id, title: e.title, dueDate: e.date }))
      .slice(0, 5);
  }, [calendarEvents]);

  const upcomingReminders: Reminder[] = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return calendarEvents
      .filter((e) => { const d = new Date(e.date); d.setHours(0, 0, 0, 0); return d > today; })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((e) => ({ id: e.id, title: e.title, dueDate: e.date }))
      .slice(0, 5);
  }, [calendarEvents]);

  const handleReminderClick = (id: string) => navigate(`/lesson/${id}`);

  // ---------- UI ----------
  if (loading || authLoading) return <div className="p-6">Loading...</div>;
  if (!authorized) return null; // กัน “วาบ” ก่อนไปหน้า login

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarWidget />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">👋 Welcome, {displayName}</h1>
            <div className="flex items-center space-x-4">
              <NotificationWidget />
              <Userwidget />
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
                {/* ฟิลเตอร์ประเภท assignment */}
                <div className="flex space-x-2">
                  {["all", "team", "specific"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAssignTypeFilter(type)}
                      className={`px-3 py-1 rounded-md text-sm capitalize ${
                        assignTypeFilter === type ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {type === "all" ? "All Types" : type}
                    </button>
                  ))}
                </div>

                <CalendarWidget events={calendarEvents} />

                <ReminderBox
                  title="🔔 Upcoming Due Lesson"
                  reminders={upcomingReminders}
                  accentColor="text-blue-600"
                  onReminderClick={handleReminderClick}
                />
                <ReminderBox
                  title="⏰ Past Due Lessons"
                  reminders={pastDueLessons}
                  accentColor="text-red-600"
                  onReminderClick={handleReminderClick}
                />
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
