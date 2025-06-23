import {
  Home,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import Logo from "../../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../Authentication/AuthContext.tsx";
const adminMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, path: "/admin" },
  { name: "Task management", icon: <Users size={20} />, path: "/admin/lesson/management" },
  { name: "Courses", icon: <BookOpen size={20} />, path: "/admin/lesson/create" },
  { name: "Notifications", icon: <Bell size={20} />, path: "/admin/notifications" }, // 🆕
  { name: "System Logs", icon: <FileText size={20} />, path: "/admin/logs" },
  { name: "Settings", icon: <Settings size={20} />, path: "/admin/setting" },
];
export default function AdminSidebarWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
      <aside className="w-64 bg-white shadow-md p-6 m-4 rounded-xl flex flex-col justify-between">
        <div>
          <img src={Logo} alt="Bangkok Bank Logo" className="h-12 mb-8" />

          <nav className="space-y-4 text-sm">
            {adminMenuItems.map(({ name, icon, path }) => (
                <Link
                    key={path}
                    to={path}
                    className={`flex items-center space-x-3 transition ${
                        location.pathname === path
                            ? "text-blue-600 font-semibold"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                  {icon}
                  <span>{name}</span>
                </Link>
            ))}
          </nav>
        </div>
        <div className="text-sm space-y-2">
          <button
              onClick={() => navigate("/admin/setting")}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center space-x-2 text-red-500 hover:underline"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Are you sure?</h2>
                <p className="text-sm text-gray-500">You will be logged out of the system.</p>
                <div className="flex justify-center space-x-4">
                  <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
        )}
      </aside>
  );
}
