import { useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext";

import SidebarWidget from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import ScoreboardChart from "../../components/ScoreboardChart";
import StatisticsChart from "../../components/StatisticsChart";
import OnlineCourseBanner from "../../components/OnlineCourseBanner";
import TopViewedLessonsWidget from "./TopViewedLessonsWidget.tsx";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const displayName = user?.name || user?.upn;

  return (
      <>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <SidebarWidget />

          {/* Main Content */}
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              👋 Welcome, {displayName}
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Central Content */}
              <div className="xl:col-span-3 space-y-6">
                <OnlineCourseBanner />
                <StatisticsChart />
                <TopViewedLessonsWidget />
              </div>

              {/* Calendar and Scoreboard */}
              <div className="order-1 xl:order-2">
                <div className="space-y-6 mt-4 xl:mt-0">
                  <CalendarWidget />
                  <ScoreboardChart />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Chat Widget */}
        <ChatBubbleWidget />
      </>
  );
};

export default UserDashboard;
