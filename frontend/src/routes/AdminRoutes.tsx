import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/Admin/Dashboard/AdminDashboard";

export const AdminRoutes = () => (
    <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
);
