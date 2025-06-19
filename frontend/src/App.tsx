import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "./pages/Forum/KnowledgeForumLayout";
import PointDashboard from "./pages/Point/PointDashboard";
import Gamedashboard from "./pages/Game/Gamedashboard";
import Rule from "./pages/Game/Rule";
import Select_role from './pages/Game/Select_role';
import Scenario from './pages/Game/Scenario';
import Question from './pages/Game/Question';


import Lessondashboard from "./pages/Lesson/Lessondashboard";
import TaskManagement from "./pages/Taskmanagement/Taskmanagement";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/lesson" element={<Lessondashboard />} />
        <Route path="/task" element={<TaskManagement/>} />
        <Route path="/forum" element={<KnowledgeForumLayout />} />
        <Route path="/point" element={<PointDashboard />} />
        <Route path="/game" element={<Gamedashboard />} />
        <Route path="/game" element={<Gamedashboard />} />
        <Route path="/rule" element={<Rule />} />
        <Route path="/select-role" element={<Select_role />} />
        <Route path="/scenario" element={<Scenario />} />
        <Route path="/question" element={<Question />} />

      </Routes>
    </Router>
  );
}
export default App;