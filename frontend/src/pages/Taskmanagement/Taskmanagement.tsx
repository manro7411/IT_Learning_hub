import React, {useContext, useEffect, useState} from 'react';
import CalendarWidget from '../../widgets/CalendarWidget';
import ScoreboardChart from '../../components/ScoreboardChart';
import Sidebar from '../../widgets/SidebarWidget';
import {AuthContext} from "../../Authentication/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget.tsx';
import NotificationWidget from '../../widgets/NotificationWidget.tsx';

interface Task {
  id: number;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  const {token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const newTaskObj: Task = {
      id: Date.now(),
      title: newTask,
      status: 'todo',
    };
    setTasks((prevTasks) => [...prevTasks, newTaskObj]);
    setNewTask('');
  };

  const updateTaskStatus = (id: number, status: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const renderColumn = (status: Task['status'], title: string) => (
    <div className="bg-gray-100 rounded-xl p-4 w-full min-h-[400px]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {tasks.filter((task) => task.status === status).map((task) => (
          <div key={task.id} className="bg-white p-4 rounded shadow">
            
            <div className="font-medium mb-2">{task.title}</div>
            <div className="flex space-x-2 text-sm">
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
    placeholder="Enter new task"
  />
  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Add Task
  </button>
</form>

    <NotificationWidget />
  </div>

  {/* Grid layout */}
  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
  {/* Left: Task columns (แนวนอน) */}
  <div className="xl:col-span-3 flex space-x-4">
    {renderColumn('todo', 'To do')}
    {renderColumn('inprogress', 'In progress')}
    {renderColumn('done', 'Done')}
  </div>

  {/* Right: Calendar & Scoreboard */}
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