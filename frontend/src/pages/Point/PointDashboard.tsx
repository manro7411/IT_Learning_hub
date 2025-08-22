import Sidebar from '../../widgets/SidebarWidget';
import ChatBubbleWidget from '../../widgets/ChatBubbleWidget';
import PointBanner from './PointBanner';
import PointhistoryLevel from './PointHistoryLevel';
import Reward from './Reward';
import { useContext } from 'react';
import { AuthContext } from '../../Authentication/AuthContext';
import { useUserScore } from './hooks/useUserScore';
import { Navigate } from 'react-router-dom';

const PointDashboard = () => {
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const { overallScore, userEmail } = useUserScore(token);

   if (!token) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6 order-2 xl:order-1">
            <PointBanner useremail={userEmail} overallScore={overallScore} />
            <PointhistoryLevel overallScore={overallScore} />
            <Reward userPoints={overallScore} />
          </div>
        </div>
      </main>
      <ChatBubbleWidget />
    </div>
  );
};
export default PointDashboard;
