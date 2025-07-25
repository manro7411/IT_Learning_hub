import {
  Home,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import Logo from "../../../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, Fragment } from "react";
import { AuthContext } from "../../../Authentication/AuthContext.tsx";

const supervisorMenuItems = [
  { name: "Dashboard", icon: <Home size={20} />, path: "/supervisor" },
  { name: "Team management", icon: <Users size={20} />, path: "/team" },
  { name: "System Logs", icon: <FileText size={20} />, path: "/logging" },
  { name: "Settings", icon: <Settings size={20} />, path: "/setting" },
];

export default function SupervisorSidebarWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Fragment>
      <aside className="w-64 bg-white shadow-md p-6 m-4 rounded-xl flex flex-col justify-between">
        <div>
          <img src={Logo} alt="Bangkok Bank Logo" className="h-12 mb-8" />

          <nav className="space-y-4 text-sm">
            {supervisorMenuItems.map(({ name, icon, path }) => (
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
      </aside>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Logout</h2>
            <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
}
