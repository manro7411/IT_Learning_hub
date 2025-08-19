// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructionModal from "../../components/InstructionModal";
import { http } from "../../Authentication/http";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // คุณภาพชีวิต: กันกดซ้ำ/โชว์ error
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;         // กันกดซ้ำ
    setSubmitting(true);
    setError(null);

    try {
      // ⚠️ เปลี่ยนมาใช้ http.post (ไม่ต้องใส่ withCredentials เพิ่ม)
      // baseURL = "/api" อยู่ใน http instance แล้ว
      const res = await http.post("/login", { email, password });

      const role = res.data?.role;
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "supervisor") {
        navigate("/supervisor");
      } else {
        navigate("/dashboard");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // โชว์ข้อความจาก backend ถ้ามี
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login failed";
      setError(msg);
      console.error("❌ Login error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
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

      {/* Right Panel (Form) */}
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
              autoComplete="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              autoComplete="current-password"
            />

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full text-white font-semibold py-2 rounded-full transition ${
                submitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? "Logging in..." : "Login"}
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
