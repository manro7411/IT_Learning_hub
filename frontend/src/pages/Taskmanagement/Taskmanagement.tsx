// src/pages/task/TaskManagement.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Sidebar from "../../widgets/SidebarWidget";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import TaskCard from "./TaskCard";
import { http } from "../../Authentication/http";

interface Task {
  id: string;
  title: string;
  status: "todo" | "inprogress" | "done";
  type: "learning";
  lessonId: string;
  thumbnailUrl?: string;
  author?: string;
  role?: string;
  progress: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  lastTimestamp: number;
}

interface LessonFromAPI {
  id: string;
  title: string;
  assignType?: string;            // "team" | "specific" | ...
  assignedUserIds?: string[];     // รายชื่อ userId ที่ถูก assign เฉพาะราย
  thumbnailUrl?: string;
  authorName?: string;
  authorRole?: string;
}

type ProgressItem = {
  lessonId: string;
  lessonTitle: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorRole?: string;
  percent: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  lastTimestamp: number;
};

type Profile = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  avatarUrl?: string;
};

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const mounted = useRef(true);

  const buildTasks = useCallback(
    (progressData: ProgressItem[], lessons: LessonFromAPI[], profile: Profile) => {
      // 1) แปลง progress → tasks
      const mapped: Task[] = progressData.map((item) => {
        let status: Task["status"] = "todo";
        if (item.percent >= 100) status = "done";
        else if (item.percent > 0) status = "inprogress";

        return {
          id: item.lessonId,
          title: item.lessonTitle,
          status,
          type: "learning",
          lessonId: item.lessonId,
          thumbnailUrl: item.thumbnailUrl,
          author: item.authorName || "Unknown",
          role: item.authorRole || "Instructor",
          progress: item.percent,
          score: item.score,
          attempts: item.attempts,
          maxAttempts: item.maxAttempts,
          lastTimestamp: item.lastTimestamp,
        };
      });

      // 2) เพิ่ม specific lessons ที่ยังไม่มี progress แต่ assign ให้ user นี้
      const meId = (profile?.id || "").trim().toLowerCase();
      const existingIds = new Set(mapped.map((t) => t.lessonId));

      const specificLessons = lessons.filter((lesson) => {
        if (lesson.assignType !== "specific") return false;
        const ids = (lesson.assignedUserIds ?? []).map((x) => (x || "").trim().toLowerCase());
        return meId && ids.includes(meId);
      });

      const additional: Task[] = specificLessons
        .filter((l) => !existingIds.has(l.id))
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          status: "todo",
          type: "learning",
          lessonId: lesson.id,
          thumbnailUrl: lesson.thumbnailUrl,
          author: lesson.authorName || "Unknown",
          role: lesson.authorRole || "Instructor",
          progress: 0,
          score: 0,
          attempts: 0,
          maxAttempts: 1,
          lastTimestamp: 0,
        }));

      return [...mapped, ...additional];
    },
    []
  );

  const load = useCallback(async () => {
    setErrMsg(null);
    setLoading(true);
    try {
      // ✅ วอร์มเซสชันก่อน: ถ้า jwt หาย/หมดอายุ → interceptor จะ refresh ให้
      try {
        await http.get<Profile>("/profile");
      } catch {
        // สำรอง: บังคับ refresh แล้วลองใหม่
        await http.post("/login/refresh");
        await http.get<Profile>("/profile");
      }

      // ✅ ตอนนี้ token สดแล้ว ค่อยดึงข้อมูลพร้อมกัน
      const [progressRes, learningRes, profileRes] = await Promise.all([
        http.get<ProgressItem[]>("/user/progress"),
        http.get<LessonFromAPI[]>("/learning"),
        http.get<Profile>("/profile"),
      ]);

      const progress = progressRes.data ?? [];
      const lessons  = learningRes.data ?? [];
      const profile  = profileRes.data as Profile;

      const allTasks = buildTasks(progress, lessons, profile);
      if (mounted.current) setTasks(allTasks);
    } catch (e) {
      console.error("❌ Error loading tasks:", e);
      if (mounted.current) setErrMsg("Failed to load tasks");
      // ถ้า refresh ไม่ผ่าน onUnauthenticated ใน http.ts จะพาไป /login เอง
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [buildTasks]);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  const updateLessonProgress = (lessonId: string, progress: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.lessonId !== lessonId) return t;
        const status: Task["status"] = progress >= 100 ? "done" : progress > 0 ? "inprogress" : "todo";
        return { ...t, progress, status };
      })
    );
  };

  const columns = useMemo(
    () => [
      { key: "todo" as const,       title: "To Do" },
      { key: "inprogress" as const, title: "In Progress" },
      { key: "done" as const,       title: "Completed" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Learning History</h1>
          <div className="fixed top-4 right-4 z-50">
            <NotificationWidget />
          </div>
        </div>

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : errMsg ? (
          <div className="p-6 text-red-600">{errMsg}</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 flex space-x-4">
              {columns.map((col) => (
                <div key={col.key} className="bg-gray-100 rounded-xl p-4 w-full min-h-[400px] space-y-4">
                  <h3 className="text-lg font-semibold mb-4">{col.title}</h3>
                  <div className="flex flex-wrap gap-5">
                    {tasks
                      .filter((t) => t.status === col.key)
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          lessonId={task.lessonId}
                          category="Learning"
                          thumbnailUrl={task.thumbnailUrl || "/placeholder.png"}
                          assignee={task.author || ""}
                          role={task.role || ""}
                          progress={task.progress}
                          onStart={() => updateLessonProgress(task.lessonId, Math.min(100, task.progress + 10))}
                          onComplete={() => updateLessonProgress(task.lessonId, 100)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="xl:col-span-1 space-y-6">{/* reserved */}</div>
          </div>
        )}
      </main>

      <ChatBubbleWidget />
    </div>
  );
};

export default TaskManagement;
