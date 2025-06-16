import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import LoginPage from "./pages/Login/LoginPage";
import UserDashboard from "./pages/Dashboard/UserDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;