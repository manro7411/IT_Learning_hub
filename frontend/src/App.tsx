// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-calendar/dist/Calendar.css";

import LoginPage from "./pages/Login/LoginPage";
import { AuthProvider } from "./Authentication/AuthContext";
import RegisterPage from "./pages/Login/Register";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AdminDashboard_overall from "./pages/Admin/Dashboard/AdminDashboard_overall";

import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { SupervisorRoutes } from "./routes/SupervisorRoutes";
import { Administrator } from "./routes/AdministratorRoutes";

import RequireAuth from "./routes/RequireAuth"; // ✅ เพิ่มบรรทัดนี้

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ถ้าหน้า admin-dashboard / admin-overall ต้องล็อกอิน ให้ย้ายเข้าใน RequireAuth ด้วย */}
          {/* <Route element={<RequireAuth />}>  // <— ถ้าต้องการล็อกอินถึงดูได้ */}
          {/*   <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
          {/*   <Route path="/admin-overall" element={<AdminDashboard_overall />} /> */}
          {/* </Route> */}

          {/* protected routes ทั้งก้อน */}
          <Route element={<RequireAuth />}>
            {UserRoutes()}
            {AdminRoutes()}
            {SupervisorRoutes()}
            {Administrator()}
          </Route>

          {/* หรือถ้า 2 หน้า admin ต้องเปิดสาธารณะ ก็ปล่อยไว้ข้างนอกได้เหมือนเดิม */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-overall" element={<AdminDashboard_overall />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
