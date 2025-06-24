import { useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext";

import SidebarWidget       from "../../widgets/SidebarWidget";
import CalendarWidget      from "../../widgets/CalendarWidget";
import ChatBubbleWidget    from "../../widgets/ChatBubbleWidget";
import ScoreboardChart     from "../../components/ScoreboardChart";
import StatisticsChart     from "../../components/StatisticsChart";
import OnlineCourseBanner  from "../../components/OnlineCourseBanner";
import TopViewedLessonsWidget from "./TopViewedLessonsWidget";
import NotificationWidget  from "../../widgets/NotificationWidget";
import {Navigate} from "react-router-dom";
// import { Navigate } from "react-router-dom"; // ← ถ้าอยาก redirect

const UserDashboard = () => {
  const { user, token: ctxToken } = useContext(AuthContext);
  const token =
      ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;

  }
  const displayName = user?.name || user?.upn || "User";
  return (
      <>
        <div className="min-h-screen bg-gray-50 flex">
          <SidebarWidget />

          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                👋 Welcome, {displayName}
              </h1>
              <NotificationWidget />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3 space-y-6">
                <OnlineCourseBanner />
                <StatisticsChart />
                <TopViewedLessonsWidget />
              </div>
              <div className="order-1 xl:order-2">
                <div className="space-y-6 mt-4 xl:mt-0">
                  <CalendarWidget />
                  <ScoreboardChart />
                </div>
              </div>
            </div>
          </main>
        </div>
        <ChatBubbleWidget />
      </>
  );
};
export default UserDashboard;
