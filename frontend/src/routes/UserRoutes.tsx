import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded components
const UserDashboard = lazy(() => import("../pages/Dashboard/UserDashboard"));
const KnowledgeForumLayout = lazy(() => import("../pages/Forum/KnowledgeForumLayout"));
const PointDashboard = lazy(() => import("../pages/Point/PointDashboard"));
const Gamedashboard = lazy(() => import("../pages/Game/Gamedashboard"));
const Lessondashboard = lazy(() => import("../pages/Lesson/Lessondashboard"));
const TaskManagement = lazy(() => import("../pages/Taskmanagement/Taskmanagement"));
const AccountSettingsPage = lazy(() => import("../pages/setting/AccountSettingsPage"));
const LessonDetailPage = lazy(() => import("../pages/Lesson/LessonDetailPage"));
const LessonVideoPage = lazy(() => import("../pages/Lesson/LessonVideoPage"));
const SelectRole = lazy(() => import("../pages/Game/Select_role"));
const Scenario = lazy(() => import("../pages/Game/Scenario"));
const Question = lazy(() => import("../pages/Game/Question"));
const AnswerTrue = lazy(() => import("../pages/Game/Answer_true"));
const AnswerFalse = lazy(() => import("../pages/Game/Answer_false"));
const Rule = lazy(() => import("../pages/Game/Rule"));
const QuizPageStyled = lazy(() => import("../pages/quiz/QuizPage"));
const PointHistoryPage = lazy(() => import("../pages/Point/PointHistoryPage"));

const UserRoutes = () => (
  <Routes>
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/lesson" element={<Lessondashboard />} />
    <Route path="/lesson/:id" element={<LessonDetailPage />} />
    <Route path="/lesson/:id/video" element={<LessonVideoPage />} />
    <Route path="/quiz/:id" element={<QuizPageStyled />} />
    <Route path="/task" element={<TaskManagement />} />
    <Route path="/forum" element={<KnowledgeForumLayout />} />
    <Route path="/point" element={<PointDashboard />} />
    <Route path="/point/history" element={<PointHistoryPage />} />
    <Route path="/game" element={<Gamedashboard />} />
    <Route path="/minigame" element={<Gamedashboard />} />
    <Route path="/settings" element={<AccountSettingsPage />} />
    <Route path="/select-role" element={<SelectRole />} />
    <Route path="/scenario/:role/:scenarioIndex" element={<Scenario />} />
    <Route path="/question/:role/:scenarioIndex" element={<Question />} />
    <Route path="/answer_true" element={<AnswerTrue />} />
    <Route path="/answer_false" element={<AnswerFalse />} />
    <Route path="/rule" element={<Rule />} />
  </Routes>
);

export default UserRoutes;
