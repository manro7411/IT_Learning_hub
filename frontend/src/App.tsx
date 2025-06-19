import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import { AuthProvider } from "./Authentication/AuthContext";
import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                </Routes>
                <UserRoutes />
                <AdminRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
