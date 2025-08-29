import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const AdminDashboard = lazy(() => import("../pages/Admin/Dashboard/AdminDashboard"));
const AdminAddLessonPage = lazy(() => import("../pages/Admin/Coursemanagement/AdminAddLessonPage"));
const AdminTaskManagementPage = lazy(() => import("../pages/Admin/Taskmanagement/AdminTaskManagementPage"));
const AdminSettingPage = lazy(() => import("../pages/Admin/AdminSetting/AdminSettingPage"));
const AdminCreateNotificationPage = lazy(() => import("../pages/Admin/AdminNotification/AdminCreateNotificationPage"));
const SystemLogging = lazy(() => import("../pages/Admin/Systemlog/Systemlogging"));
const TeamManagement = lazy(() => import("../pages/Admin/Teammanagement/Teammanagement"));

const AdminRoutes = () => (
  <Suspense fallback={<div>Loading admin pages...</div>}>
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="lesson/create" element={<AdminAddLessonPage />} />
      <Route path="lesson/management" element={<AdminTaskManagementPage />} />
      <Route path="setting" element={<AdminSettingPage />} />
      <Route path="notifications" element={<AdminCreateNotificationPage />} />
      <Route path="logs" element={<SystemLogging />} />
      <Route path="team" element={<TeamManagement />} />
    </Routes>
  </Suspense>
);

export default AdminRoutes;
