import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";
import AdminAddLessonPage from "../pages/Admin/Coursemanagement/AdminAddLessonPage.tsx";

export const AdminRoutes = () => (
    <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/lesson/create" element={<AdminAddLessonPage />} />
    </Routes>
);
