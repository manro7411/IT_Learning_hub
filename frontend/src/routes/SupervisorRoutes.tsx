import SupervisorDashboard from "../pages/Supervisor/Supervisordashboard";
import {Route} from "react-router-dom";
export const SupervisorRoutes = () => (
    <>
        <Route path="/supervisor" element={<SupervisorDashboard />} />
    </>
);