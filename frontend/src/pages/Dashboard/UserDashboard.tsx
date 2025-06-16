import CalendarWidget from '../../widgets/CalendarWidget';
import SidebarWidget from '../../widgets/SidebarWidget';
import bgImage from '../../assets/backgroundcourse.png';
import ScoreboardChart from '../../components/ScoreboardChart';
import StatisticsChart from '../../components/StatisticsChart';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SidebarWidget />

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Central content (3/4 width) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Online Course Banner */}
            <div
              className="rounded-xl p-6 text-white bg-cover bg-center"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <div className="mb-4">
                <div className="text-sm font-light">ONLINE COURSE</div>
                <div className="text-2xl font-semibold mt-1">
                  Your journey to smarter learning starts here.
                </div>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-4 py-2 rounded-full">
                Join Now ▶
              </button>
            </div>

            {/* Statistics Chart */}
            <StatisticsChart />

            {/* Lessons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Agile', 'Scrum', 'Waterfall'].map((title, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-md">
                  <div className="text-sm text-purple-600 font-medium mb-2">
                    {title}
                  </div>
                  <div className="text-lg font-semibold">
                    {title} Methodologies Overview
                  </div>
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
          <div className="order-1 xl:order-2">
            <div className="space-y-6 mt-4 xl:mt-0">
              <CalendarWidget />
              <ScoreboardChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
