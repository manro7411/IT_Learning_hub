import { useContext, useEffect, useState } from 'react';
import Sidebar from '../../widgets/SidebarWidget';
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget.tsx';
import NotificationWidget from '../../widgets/NotificationWidget.tsx';
import TaskCard from './TaskCard.tsx';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  type: 'learning';
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
  assignType?: string;
  assignedUserIds?: string[];
  thumbnailUrl?: string;
  authorName?: string;
  authorRole?: string;
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchProgress = async () => {
      try {
        const [progessRes, learningRes, profileRes] = await Promise.all([
          fetch("/api/user/progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/learning", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!progessRes.ok || !learningRes.ok || !profileRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const progressData = await progessRes.json();
        const lessons: LessonFromAPI[] = await learningRes.json();
        const profile = await profileRes.json();

        // Filter specific lessons assigned to this user
        const specificLessons = lessons
          .filter(lesson =>
            lesson.assignType === "specific" &&
            Array.isArray(lesson.assignedUserIds) &&
            lesson.assignedUserIds
              .map(id => id.trim().toLowerCase())
              .includes(profile.id.trim().toLowerCase())
          );

        // console.log("🎯 Filtered Specific Lessons:", specificLessons);

        // Map progress data to tasks
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedTasks: Task[] = progressData.map((item: any) => {
          let status: Task['status'] = 'todo';
          if (item.percent >= 100) status = 'done';
          else if (item.percent > 0) status = 'inprogress';

          return {
            id: item.lessonId,
            title: item.lessonTitle,
            status,
            type: 'learning',
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

        // Add specific lessons that are not already in progressData
        const existingLessonIds = new Set(mappedTasks.map(task => task.lessonId));
        const additionalTasks: Task[] = specificLessons
          .filter(lesson => !existingLessonIds.has(lesson.id))
          .map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            status: 'todo',
            type: 'learning',
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

        const allTasks = [...mappedTasks, ...additionalTasks];
        // console.log("🧩 Final Combined Tasks:", allTasks);

        setTasks(allTasks);
      } catch (err) {
        console.error("❌ Error loading learner history:", err);
      }
    };

    fetchProgress();
  }, [token, navigate]);

  const updateLessonProgress = (lessonId: string, progress: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.lessonId !== lessonId) return task;

        const newStatus: Task['status'] = progress >= 100 ? 'done' : 'inprogress';

        return {
          ...task,
          progress,
          status: newStatus,
        };
      })
    );
  };

  const renderColumn = (status: Task['status'], title: string) => (
    <div className="bg-gray-100 rounded-xl p-4 w-full min-h-[400px] space-y-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-5">
        {tasks
          .filter((task) => task.status === status)
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
              onStart={() => updateLessonProgress(task.lessonId, task.progress + 10)}
              onComplete={() => updateLessonProgress(task.lessonId, 100)}
            />
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Learning History</h1>
        </div>

        <div className="fixed top-4 right-4 z-50">
          <NotificationWidget />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 flex space-x-4">
            {renderColumn('todo', 'To Do')}
            {renderColumn('inprogress', 'In Progress')}
            {renderColumn('done', 'Completed')}
          </div>
          <div className="xl:col-span-1 space-y-6">
            {/* Optional: Add filters or summary here */}
          </div>
        </div>
      </main>
      <ChatBubbleWidget />
    </div>
  );
};

export default TaskManagement;
