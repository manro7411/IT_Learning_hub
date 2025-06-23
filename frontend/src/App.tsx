import Select_role from "./pages/Game/Select_role";
import Scenario from "./pages/Game/Scenario";
import Question from "./pages/Game/Question";
import AnswerTrue from "./pages/Game/Answer_true";
import AnswerFalse from "./pages/Game/Answer_false";
import Lessondashboard from "./pages/Lesson/Lessondashboard";
import Taskmanagement from "./pages/Taskmanagement/Taskmanagement";
import AuthProvider from "./Authentication/AuthContext";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import RegisterPage from "./pages/Login/Register.tsx";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.tsx";
import Userdashboard from "./pages/User/Userdashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Userdashboard />} />
          <Route path="/lesson" element={<Lessondashboard />} />
          <Route path="/task" element={<Taskmanagement />} />
          <Route path="/select-role" element={<Select_role />} />
          <Route path="/scenario" element={<Scenario />} />
          <Route path="/question" element={<Question />} />
          <Route path="/answer_true" element={<AnswerTrue />} />
          <Route path="/answer_false" element={<AnswerFalse />} />
          <UserRoutes />
          <AdminRoutes />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
