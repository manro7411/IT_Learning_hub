import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminAddLessonPage from "../pages/Admin/Coursemanagement/AdminAddLessonPage.tsx";
import AdminTaskManagementPage from "../pages/Admin/Taskmanagement/AdminTaskManagementPage.tsx";
import AdminSettingPage from "../pages/Admin/AdminSetting/AdminSettingPage.tsx";
import AdminCreateNotificationPage from "../pages/Admin/AdminNotification/AdminCreateNotificationPage.tsx";
import {Route} from "react-router-dom";
import Systemlogging from "../pages/Admin/Systemlog/Systemlogging.tsx";
import Teammanagement from "../pages/Admin/Teammanagement/Teammanagement.tsx";
import AdminAddBlog from "../pages/Admin/AdminBlog/AdminAddBlog.tsx"

export const AdminRoutes = () => (
    <>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/lesson/create" element={<AdminAddLessonPage />} />
        <Route path="/admin/lesson/management" element={<AdminTaskManagementPage/>} />
        <Route path="/admin/setting" element={<AdminSettingPage/>}/>
        <Route path="/admin/notifications" element={<AdminCreateNotificationPage />} />
        <Route path="/admin/logs" element={<Systemlogging/>} />
        <Route path="/admin/addblog" element={<AdminAddBlog/>} />
        <Route path="/admin/team" element={<Teammanagement/>} />
    </>
);