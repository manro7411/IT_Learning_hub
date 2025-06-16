import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "./pages/Forum/KnowledgeForumLayout";
import PointDashboard from "./pages/Point/PointDashboard";
import Gamedashboard from "./pages/Game/Gamedashboard";
import Lessondashboard from "./pages/Lesson/Lessondashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/lesson" element={<Lessondashboard />} />
        <Route path="/task" element={<Lessondashboard />} />
        <Route path="/forum" element={<KnowledgeForumLayout />} />
        <Route path="/point" element={<PointDashboard />} />
        <Route path="/game" element={<Gamedashboard />} />
        <Route path="/game" element={<Gamedashboard />} />
      </Routes>
    </Router>
  );
}
export default App;