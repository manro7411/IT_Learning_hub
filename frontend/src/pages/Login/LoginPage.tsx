import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructionModal from "../../components/InstructionModal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  email: string;
  role?: string;
  groups?: string[];
  [key: string]: unknown;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true)

    try {
      const res = await axios.post("/api/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded: JwtPayload = jwtDecode(token);
      const role = (decoded.role ?? decoded.groups?.[0] ?? "user").toLowerCase();

      // await new Promise((resolve) => setTimeout(resolve, 1000));

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "supervisor") {
        navigate("/supervisor");
        
      }else{
        navigate("/dashboard");
      }
      window.location.reload();

    } catch (err) {
      alert("Login failed");
      console.error("❌ Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full h-screen flex flex-col md:flex-row">
        {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
        {/* Left Panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col justify-center items-center p-8">
          <h1 className="text-5xl font-bold mb-4 text-center">IT Learning Hub</h1>
          <p className="text-lg mb-6 text-center">E-learning-platform</p>
          <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-full shadow hover:opacity-90 transition"
          >
            Read More
          </button>
        </div>

        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hello Again!</h2>
            <p className="text-sm text-gray-500 mb-6">Welcome Back</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="firstname.lastname@example.com"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
              />
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
              />
              <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="/register" className="text-sm text-blue-600 hover:underline">
                Don't have an account? Register
              </a>
            </div>
          </div>
        </div>

        <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
  );
};

export default LoginPage;