import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";
import KnowledgeForumLayout from "./pages/Forum/KnowledgeForumLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/forum" element={<KnowledgeForumLayout />} />
      </Routes>
    </Router>
  );
}
export default App;