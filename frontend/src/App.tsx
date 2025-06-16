import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import UserDashboard from "./components/Dashboard/UserDashboard";
import 'react-calendar/dist/Calendar.css';

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