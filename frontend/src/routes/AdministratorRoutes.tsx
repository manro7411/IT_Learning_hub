import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded administrator components
const Sdashboard = lazy(() => import("../pages/Administrator/Sdashboard"));
const AdministratorUserManagement = lazy(() => import("../pages/Administrator/administratorusermanagement"));
const AdministratorCourseManagement = lazy(() => import("../pages/Administrator/administratorcoursemanagement"));
const AdministratorNotification = lazy(() => import("../pages/Administrator/administratorNotification"));
const AdministratorLogging = lazy(() => import("../pages/Administrator/administratorlogging"));

const AdministratorRoutes = () => (
  <Routes>
    <Route path="/administrator" element={<Sdashboard />} />
    <Route path="/administrator/user/management" element={<AdministratorUserManagement />} />
    <Route path="/administrator/course/management" element={<AdministratorCourseManagement />} />
    <Route path="/administrator/notification" element={<AdministratorNotification />} />
    <Route path="/administrator/system/log" element={<AdministratorLogging />} />
  </Routes>
);

export default AdministratorRoutes;
