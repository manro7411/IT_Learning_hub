import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "../pages/Forum/KnowledgeForumLayout";
import PointDashboard from "../pages/Point/PointDashboard";
import Gamedashboard from "../pages/Game/Gamedashboard";
import Lessondashboard from "../pages/Lesson/Lessondashboard";
import TaskManagement from "../pages/Taskmanagement/Taskmanagement";
import AccountSettingsPage from "../pages/setting/AccountSettingsPage";
import LessonDetailPage from "../pages/Lesson/LessonDetailPage";

export const UserRoutes = () => (
    <Routes>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/lesson" element={<Lessondashboard />} />
        <Route path="/lesson/:id" element={<LessonDetailPage />} />
        <Route path="/task" element={<TaskManagement />} />
        <Route path="/forum" element={<KnowledgeForumLayout />} />
        <Route path="/point" element={<PointDashboard />} />
        <Route path="/game" element={<Gamedashboard />} />
        <Route path="/settings" element={<AccountSettingsPage />} />
    </Routes>
);
