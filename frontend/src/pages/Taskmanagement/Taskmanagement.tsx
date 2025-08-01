import { useContext, useEffect, useState } from 'react';
import Sidebar from '../../widgets/SidebarWidget';
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget.tsx';
import NotificationWidget from '../../widgets/NotificationWidget.tsx';
import LessonCard from '../Lesson/LessonCard.tsx';

interface Task {
  id: number | string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  type?: 'task' | 'learning';
  lessonId?: string;
  thumbnailUrl?: string;
  author?: string;
  role?: string;
  progress?: number;
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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          credentials: "include"
        });
        if (!res.ok) return;
        const profile = await res.json();
        setUserId(profile.id);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (!userId) return;

    const fetchLearningTasks = async () => {
      try {
        const res = await fetch("/api/learning", {
          credentials: "include"
        });
        if (!res.ok) return;
        const lessons: LessonFromAPI[] = await res.json();

        const specificLessons = lessons.filter(
          (lesson) =>
            lesson.assignType === "specific" &&
            Array.isArray(lesson.assignedUserIds) &&
            lesson.assignedUserIds.includes(userId)
        );

        const learningTasks: Task[] = specificLessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          status: 'todo',
          type: 'learning',
          lessonId: lesson.id,
          thumbnailUrl: lesson.thumbnailUrl || "/placeholder.png",
          author: lesson.authorName || "Unknown",
          role: lesson.authorRole || "Instructor",
          progress: 0,
        }));

        setTasks(prev => {
          const prevLearningIds = new Set(prev.filter(t => t.type === 'learning').map(t => t.lessonId));
          const newLearning = learningTasks.filter(t => !prevLearningIds.has(t.lessonId));
          return [...prev, ...newLearning];
        });
      } catch (err) {
        console.error("Failed to fetch learning tasks", err);
      }
    };

    fetchLearningTasks();
  }, [userId]);

  const updateTaskStatus = (id: number | string, status: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const updateLessonProgress = (lessonId: string, progress: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.lessonId !== lessonId) return task;

        const newStatus: Task['status'] =
          progress >= 100 ? 'done' : 'inprogress';

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
      <div className="space-y-4">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <div key={task.id} className="w-full">
              {task.type === 'learning' && task.lessonId ? (
                <LessonCard
                  title={task.title}
                  category="Learning"
                  thumbnailUrl={task.thumbnailUrl || "/placeholder.png"}
                  author={task.author || "Unknown"}
                  role={task.role || "Instructor"}
                  progress={task.progress || 0}
                  onStart={() => updateLessonProgress(task.lessonId!, 10)}
                  onComplete={() => updateLessonProgress(task.lessonId!, 100)}
                />
              ) : (
                <div className="bg-white p-4 rounded shadow">
                  <div className="font-medium mb-2">{task.title}</div>
                  <div className="flex space-x-2 text-sm mt-2">
                    {status !== 'todo' && (
                      <button onClick={() => updateTaskStatus(task.id, 'todo')} className="text-blue-500 hover:underline">
                        To do
                      </button>
                    )}
                    {status !== 'inprogress' && (
                      <button onClick={() => updateTaskStatus(task.id, 'inprogress')} className="text-yellow-500 hover:underline">
                        In progress
                      </button>
                    )}
                    {status !== 'done' && (
                      <button onClick={() => updateTaskStatus(task.id, 'done')} className="text-green-500 hover:underline">
                        Done
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
    
     
        </div>
          <div className="fixed top-4 right-4 z-50">
      <NotificationWidget />
    </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 flex space-x-4">
            {renderColumn('todo', 'To do')}
            {renderColumn('inprogress', 'In progress')}
            {renderColumn('done', 'Done')}
          </div>
          <div className="xl:col-span-1 space-y-6">
          </div>
        </div>
      </main>
      <ChatBubbleWidget />
    </div>
  );
};

export default TaskManagement;
