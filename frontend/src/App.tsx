import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "./pages/Forum/KnowledgeForumLayout";
import PointDashboard from "./pages/Point/PointDashboard";
import Gamedashboard from "./pages/Game/Gamedashboard";
import Lessondashboard from "./pages/Lesson/Lessondashboard";
import TaskManagement from "./pages/Taskmanagement/Taskmanagement.tsx";
import { AuthProvider } from "./Authentication/AuthContext";
import AccountSettingsPage from "./pages/setting/AccountSettingsPage.tsx";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.tsx";

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
             <Route path="/settings" element={<AccountSettingsPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/lesson" element={<Lessondashboard />} />
            <Route path="/task" element={<TaskManagement/>} />
            <Route path="/forum" element={<KnowledgeForumLayout />} />
            <Route path="/point" element={<PointDashboard />} />
            <Route path="/game" element={<Gamedashboard />} />
            <Route path="/game" element={<Gamedashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />

          </Routes>
        </Router>
      </AuthProvider>
  );
}
export default App;


