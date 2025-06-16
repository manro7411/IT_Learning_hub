// src/components/Sidebar.tsx
import {
  Home,
  // Inbox,
  BookOpen,
  ClipboardList,
  Users,
  Star,
  Gamepad2,
  Settings,
  LogOut,
  UserCircle,
} from 'lucide-react';
import Logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  // { name: 'Inbox', icon: <Inbox size={20} />, path: '/inbox' },
  { name: 'Lesson', icon: <BookOpen size={20} />, path: '/lesson' }, 
  { name: 'Task', icon: <ClipboardList size={20} />, path: '/task' },
  { name: 'Group', icon: <Users size={20} />, path: '/forum' },
  { name: 'Point', icon: <Star size={20} />, path: '/point' },
  { name: 'Game', icon: <Gamepad2 size={20} />, path: '/game' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white shadow-md p-6 m-4 rounded-xl flex flex-col justify-between">
      <div>
        <img src={Logo} alt="Bangkok Bank Logo" className="h-12 mb-8" />

        {/* Menu */}
        <nav className="space-y-4 text-sm">
          {menuItems.map((item, i) => (
            <Link
              to={item.path}
              key={i}
              className={`flex items-center space-x-3 hover:text-blue-600 transition ${
                location.pathname === item.path ? 'text-blue-600 font-semibold' : 'text-black'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Friends */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">FRIENDS</h3>
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <UserCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Firstname Lastname</div>
                    <div className="text-xs text-gray-500">Software Developer</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="text-sm space-y-2">
        <div className="flex items-center space-x-2 text-gray-700">
          <Settings size={18} />
          <span>Settings</span>
        </div>
        <div className="flex items-center space-x-2 text-red-500">
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
