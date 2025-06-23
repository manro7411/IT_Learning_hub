import { Routes, Route } from "react-router-dom";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "../pages/Forum/KnowledgeForumLayout";
import PointDashboard from "../pages/Point/PointDashboard";
import Gamedashboard from "../pages/Game/Gamedashboard";
import Lessondashboard from "../pages/Lesson/Lessondashboard";
import TaskManagement from "../pages/Taskmanagement/Taskmanagement";
import AccountSettingsPage from "../pages/setting/AccountSettingsPage";
import LessonDetailPage from "../pages/Lesson/LessonDetailPage";
import LessonVideoPage from "../pages/Lesson/LessonVideoPage.tsx";
import Select_role from "../pages/Game/Select_role.tsx";
import Scenario from "../pages/Game/Scenario.tsx";
import Question from "../pages/Game/Question.tsx";
import AnswerTrue from "../pages/Game/Answer_true.tsx";
import AnswerFalse from "../pages/Game/Answer_false.tsx";

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
        <Route path="/lesson/:id/video" element={<LessonVideoPage />} />
        <Route path="/lesson" element={<Lessondashboard />} />
        <Route path="/select-role" element={<Select_role />} />
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/question" element={<Question />} />
        <Route path="/answer_true" element={<AnswerTrue />} />
        <Route path="/answer_false" element={<AnswerFalse />} />

    </Routes>
);

