import Logo1 from '../../assets/logo.png';
import CalendarWidget from './CalendarWidget';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
        <div>
          <img src={Logo1} alt="Bangkok Bank Logo" className="h-8 mb-8" />
          <nav className="space-y-4 text-sm">
            <div className="text-blue-600 font-semibold">Dashboard</div>
            <div>Inbox</div>
            <div>Lesson</div>
            <div>Task</div>
            <div>Group</div>
            <div>Point</div>
            <div>Game</div>
          </nav>

          <div className="mt-10">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">FRIENDS</h3>
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Firstname Lastname</div>
                    <div className="text-xs text-gray-500">Software Developer</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm space-y-2">
          <div className="flex items-center space-x-2 text-gray-700">
            <span>⚙️</span> <span>Settings</span>
          </div>
          <div className="flex items-center space-x-2 text-red-500">
            <span>🚪</span> <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Central content (3/4 width) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Online Course Banner */}
            <div className="bg-blue-700 text-white rounded-xl p-6 flex justify-between items-center">
              <div>
                <div className="text-sm font-light">ONLINE COURSE</div>
                <div className="text-2xl font-semibold mt-1">Your journey to smarter learning starts here.</div>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-4 py-2 rounded-full">Join Now ▶</button>
            </div>

            {/* Statistics Chart */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-gray-700">Statistics</h2>
                <div className="space-x-2 text-sm text-gray-500">
                  <button className="text-blue-600 font-medium">Month</button>
                  <button>Day</button>
                  <button>Week</button>
                  <button>Year</button>
                </div>
              </div>
              <div className="h-40 flex items-center justify-center text-gray-400">[ Chart Placeholder ]</div>
            </div>

            {/* Lessons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Agile', 'Scrum', 'Waterfall'].map((title, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-sm text-purple-600 font-medium mb-2">{title}</div>
                  <div className="text-lg font-semibold">{title} Methodologies Overview</div>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium">Firstname Lastname</div>
                      <div className="text-xs text-gray-500">Software Developer</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar (1/4 width) */}
          <div>
            <CalendarWidget />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;