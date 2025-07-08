import React, { useContext, useEffect, useState } from 'react';
import CalendarWidget from '../../widgets/CalendarWidget';
import Sidebar from '../../widgets/SidebarWidget';
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget.tsx';
import NotificationWidget from '../../widgets/NotificationWidget.tsx';
import LessonCard from '../Lesson/LessonCard.tsx';
import ScoreboardChart from '../../widgets/ScoreboardChart.tsx';

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

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
  const { t } = useTranslation("usertask");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const profile = await res.json();
        setUserId(profile.id);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchLearningTasks = async () => {
      try {
        const res = await fetch("http://localhost:8080/learning", {
          headers: { Authorization: `Bearer ${token}` }
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
  }, [token, userId]);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const newTaskObj: Task = {
      id: Date.now(),
      title: newTask,
      status: 'todo',
      type: 'task',
    };
    setTasks((prevTasks) => [...prevTasks, newTaskObj]);
    setNewTask('');
  };

  const updateTaskStatus = (id: number | string, status: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
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
                  progress={task.progress || 100}
                />
              ) : (
                <div className="bg-white p-4 rounded shadow">
                  <div className="font-medium mb-2">{task.title}</div>
                  <div className="flex space-x-2 text-sm mt-2">
                    {status !== 'todo' && (
                      <button onClick={() => updateTaskStatus(task.id, 'todo')} className="text-blue-500 hover:underline">
                        {t('todo')}
                      </button>
                    )}
                    {status !== 'inprogress' && (
                      <button onClick={() => updateTaskStatus(task.id, 'inprogress')} className="text-yellow-500 hover:underline">
                        {t('inprogress')}
                      </button>
                    )}
                    {status !== 'done' && (
                      <button onClick={() => updateTaskStatus(task.id, 'done')} className="text-green-500 hover:underline">
                        {t('done')}
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
          <form onSubmit={handleAddTask} className="flex w-full max-w-2xl space-x-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('enter')}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {t('add')}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <NotificationWidget />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 flex space-x-4">
            {renderColumn('todo', t('todo'))}
            {renderColumn('inprogress', t('inprogress'))}
            {renderColumn('done', t('done'))}
          </div>

          <div className="xl:col-span-1 space-y-6">
            <CalendarWidget />
            <ScoreboardChart />
          </div>
        </div>
      </main>
      <ChatBubbleWidget />
    </div>
  );
};

export default TaskManagement;
