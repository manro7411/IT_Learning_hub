import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';

import LoginPage from "./pages/Login/LoginPage";
import { AuthProvider } from "./Authentication/AuthContext";
import RegisterPage from "./pages/Login/Register.tsx";
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import AdminDashboard_overall from './pages/Admin/Dashboard/AdminDashboard_overall';

import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/admin-overall" element={<AdminDashboard_overall />} />
                    {UserRoutes()}
                    {AdminRoutes()}
                </Routes>
            </Router>
        </AuthProvider>
    );
}
export default App;
