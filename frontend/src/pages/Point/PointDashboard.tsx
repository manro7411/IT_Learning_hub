import CalendarWidget from '../../widgets/CalendarWidget';
import { Gift, Medal } from 'lucide-react';
import Sidebar from '../../widgets/SidebarWidget';
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget';

const rewards = [
  { name: 'Tumbler', points: 200 },
  { name: 'Canvas Bag', points: 150 },
  { name: 'Notebook', points: 100 },
];

const PointDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Center Section */}
          <div className="xl:col-span-3 space-y-6 order-2 xl:order-1">
            {/* Points Banner */}
            <div className="bg-blue-700 text-white rounded-xl p-6 bg-[url('/src/assets/backgroundcourse.png')] bg-cover">
              <div className="text-sm uppercase">Point Overview</div>
              <div className="text-2xl font-semibold mt-2 flex items-center space-x-2">
                <span>Reward Points</span>
                <span className="text-yellow-300 text-3xl">⭐</span>
                <span className="text-3xl font-bold">500</span>
              </div>
            </div>

            {/* History & Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-100 rounded-xl p-4 flex items-center space-x-4 shadow">
                <Gift className="text-indigo-500 w-8 h-8" />
                <span className="text-lg font-medium text-indigo-700">History</span>
              </div>
              <div className="bg-indigo-100 rounded-xl p-4 shadow">
                <div className="text-sm text-gray-600">Level</div>
                <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
                  Silver <Medal className="text-indigo-400 w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500">just a litter more!</div>
                <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-2 w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Reward</h2>
              {rewards.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-blue-100 px-6 py-4 rounded-full shadow text-sm"
                >
                  <div>
                    <div className="text-base font-semibold text-blue-800">{item.name}</div>
                    <div className="text-xs text-blue-600">{item.points} points to redeem</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1 rounded-full">
                    Redeem
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Calendar */}
          <div className="order-1 xl:order-2 space-y-6">
            <CalendarWidget />
            <div className="bg-white p-4 rounded-xl shadow text-sm">
              <h3 className="font-semibold mb-2">Must-read posts</h3>
              <ul className="list-disc ml-4 space-y-1 text-blue-600">
                <li>
                  <a href="#">Please read rules before you start working on a platform</a>
                </li>
                <li>
                  <a href="#">Vision & Strategy of Alemhelp</a>
                </li>
              </ul>
              <hr className="my-3" />
              <h3 className="font-semibold mb-2">Featured links</h3>
              <ul className="list-disc ml-4 space-y-1 text-blue-600">
                <li>
                  <a href="#">Alemhelp source-code on GitHub</a>
                </li>
                <li>
                  <a href="#">Golang best-practices</a>
                </li>
                <li>
                  <a href="#">Alem.School dashboard</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <ChatBubbleWidget />
    </div>
  );
};
export default PointDashboard;