import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminAddLessonPage from "../pages/Admin/Coursemanagement/AdminAddLessonPage.tsx";
import AdminTaskManagementPage from "../pages/Admin/Taskmanagement/AdminTaskManagementPage.tsx";
import AdminSettingPage from "../pages/Admin/AdminSetting/AdminSettingPage.tsx";

export const AdminRoutes = () => (
    <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/lesson/create" element={<AdminAddLessonPage />} />
        <Route path="/admin/lesson/management" element={<AdminTaskManagementPage/>} />
        <Route path="/admin/setting" element={<AdminSettingPage/>}/>
    </Routes>
);
