import CalendarWidget from "../../widgets/CalendarWidget";
import Sidebar from "../../widgets/SidebarWidget";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../Authentication/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

const KnowledgeForumLayout = () => {
    const { token: ctxToken } = useContext(AuthContext);
    const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Left */}
      <Sidebar />

      {/* Main Content - Center */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Top Buttons */}
        <div className="flex gap-2 mb-6">
          {['New', 'Top', 'Hot', 'Closed'].map((label, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-full text-sm border ${
                label === 'New'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-400 border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                  <div className="text-sm font-semibold">User {index + 1}</div>
                  <div className="text-xs text-gray-500">5 min ago</div>
                </div>
              </div>
              <div className="text-base font-semibold text-gray-800">
                Sample Post Title {index + 1}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
              <div className="flex gap-2 text-xs text-gray-400 mt-3">
                <span>👁 125</span>
                <span>💬 15</span>
                <span>⬆️ 155</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Side - Calendar */}
      <aside className="w-80 p-6 hidden lg:block">
        <CalendarWidget />
        {/* Optional: More widgets here */}
      </aside>
    </div>
  );
};

export default KnowledgeForumLayout;
