import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructionModal from "./../../components/InstructionModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-b from-blue-500 to-blue-800 text-white flex flex-col justify-center items-center p-8">
          <h1 className="text-5xl font-bold mb-4 text-center">BBL Learning Hub</h1>
          <p className="text-lg mb-6 text-center">E-learning-platform</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-white text-blue-700 font-semibold py-2 px-6 rounded-full shadow hover:opacity-90 transition"
          >
            Read More
          </button>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hello Again!</h2>
            <p className="text-sm text-gray-500 mb-6">Welcome Back</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="users"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="password"
                placeholder="********"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-full hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>

            <div className="text-center mt-4">
              <a href="#" className="text-sm text-gray-500 hover:underline">
                Forgot Password
              </a>
            </div>
          </div>
        </div>
      </div>

      <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default LoginPage;