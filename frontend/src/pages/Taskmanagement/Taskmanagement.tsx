import CalendarWidget from '../../widgets/CalendarWidget';
import Sidebar from '../../widgets/SidebarWidget';
import { AuthContext } from "../../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget';
import NotificationWidget from '../../widgets/NotificationWidget';
import { useContext, useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  description?: string;
  lessonId?: string;
}

interface LessonApiResponse {
  id: string;
  title: string;
  description: string;
  assignType: 'all' | 'team' | 'specific';
  assignedUserIds?: string[];
}

const TaskManagement = () => {
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8080/learning/assigned-to-me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch lessons');
        const lessons: LessonApiResponse[] = await response.json();

        const convertedTasks: Task[] = lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          lessonId: lesson.id,
          status: 'todo', // Default as 'todo' on first load
        }));

        setTasks(convertedTasks);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchTasks();
  }, [token, navigate]);

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const renderColumn = (status: Task['status'], title: string) => (
    <div className="bg-gray-100 rounded-xl p-4 w-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <div key={task.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium mb-2">{task.title}</div>
              {task.description && (
                <div className="text-gray-600 text-sm mb-2">{task.description}</div>
              )}
              {task.lessonId && (
                <a
                  href={`/lesson/${task.lessonId}`}
                  className="text-purple-600 hover:underline text-xs"
                >
                  Go to Lesson
                </a>
              )}
              <div className="flex space-x-2 text-sm mt-2">
                {status !== 'todo' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'todo')}
                    className="text-blue-500 hover:underline"
                  >
                    To do
                  </button>
                )}
                {status !== 'inprogress' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'inprogress')}
                    className="text-yellow-500 hover:underline"
                  >
                    In progress
                  </button>
                )}
                {status !== 'done' && (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'done')}
                    className="text-green-500 hover:underline"
                  >
                    Done
                  </button>
                )}
              </div>
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
          <div className="text-xl font-bold text-gray-700">📋 My Tasks</div>
          <NotificationWidget />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 flex space-x-4">
            {renderColumn('todo', 'To do')}
            {renderColumn('inprogress', 'In progress')}
            {renderColumn('done', 'Done')}
          </div>

          <div className="xl:col-span-1 space-y-6">
            <CalendarWidget />
          </div>
        </div>
      </main>

      <ChatBubbleWidget />
    </div>
  );
};

export default TaskManagement;
