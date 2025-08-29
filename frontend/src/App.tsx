import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import 'react-calendar/dist/Calendar.css';

import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Login/Register.tsx";
import { AuthProvider } from "./Authentication/AuthContext";

// Lazy load route modules with a delay
const delayImport = <T extends { default: React.ComponentType<any> }>(importFunc: () => Promise<T>) =>
  new Promise<T>((resolve) => setTimeout(() => importFunc().then(resolve), 1000)); // Add 1-second delay

const UserRoutes = lazy(() => delayImport(() => import("./routes/UserRoutes")));
const AdminRoutes = lazy(() => delayImport(() => import("./routes/AdminRoutes")));
const SupervisorRoutes = lazy(() => delayImport(() => import("./routes/SupervisorRoutes")));
const AdministratorRoutes = lazy(() => delayImport(() => import("./routes/AdministratorRoutes")));

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                       <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
                    </div>
                }>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/*" element={<UserRoutes />} />
                        <Route path="/admin/*" element={<AdminRoutes />} />
                        <Route path="/supervisor/*" element={<SupervisorRoutes />} />
                        <Route path="/administrator/*" element={<AdministratorRoutes />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;