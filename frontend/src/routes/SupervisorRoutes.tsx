import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy-loaded supervisor component
const SupervisorDashboard = lazy(() => import("../pages/Supervisor/Supervisordashboard"));

const SupervisorRoutes = () => (
  <Routes>
    <Route path="/supervisor" element={<SupervisorDashboard />} />
  </Routes>
);

export default SupervisorRoutes;
