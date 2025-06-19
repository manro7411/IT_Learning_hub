import { useState } from 'react';
import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom';

const roles = [
  { name: 'Product Owner', emoji: '👩🏻‍💼', key: 'po' },
  { name: 'Developer', emoji: '🧑🏻‍💻', key: 'dev' },
  { name: 'Scrum Master', emoji: '👨🏼‍🏫', key: 'sm' },
];

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <SidebarWidget />

      {/* Main layout */}
      <main className="flex-1 p-10 relative flex">
        {/* ปุ่มกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 bg-orange-400 w-12 h-10 rounded-xl shadow-md font-bold text-lg text-white"
          
        >
          &lt;&lt;
        </button>

        {/* ฝั่งซ้าย: Header + Select Button */}
        <div className="flex flex-col justify-center items-center w-1/2">
          <h1
            className="text-5xl font-extrabold text-center mb-10 text-blue-600"
            style={{
              fontFamily: '"Happy Monkey", cursive',
              textShadow: '2px 2px 6px rgba(0, 0, 255, 0.3)',
            }}
          >
            SELECT <br /> YOUR ROLE
          </h1>

        <button
            onClick={() => {
                if (selectedRole) {
                    navigate('/scenario'); // ✅ ไปหน้า Scenario
                }
            }}
            disabled={!selectedRole}
            className={`mt-4 px-10 py-3 rounded-full text-white text-xl font-bold shadow-md transition-all ${
                selectedRole
                    ? 'bg-green-400 hover:bg-green-500'
                    : 'bg-gray-300 cursor-not-allowed'
            }`}
            style={{ fontFamily: '"Happy Monkey", cursive' }}
            >
                select
        </button>
        </div>

        {/* ฝั่งขวา: Role Choices + Responsibilities */}
        <div className="flex flex-col items-center justify-center w-1/2 gap-6">
          <div className="border-4 border-blue-600 rounded-2xl p-5 bg-white shadow-2xl w-[470px]">
        <div className="flex flex-col gap-4">

              {roles.map((role) => (
                <button
                  key={role.key}
                  className={`rounded-2xl px-8 py-6 text-xl shadow-lg transition-all font-syne ${
                    selectedRole === role.key
                      ? 'bg-blue-700 text-white'
                      : 'bg-blue-400 text-white hover:bg-blue-500'
                  }`}
                  onClick={() => setSelectedRole(role.key)}
                >
                  {role.emoji} {role.name}
                </button>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="font-syne text-sm max-w-md text-left text-gray-700">
            <span className="text-blue-600 font-bold block mb-2">RESPONSIBILITIES:</span>
            <p><strong>PO:</strong> Defines the product vision, manages stakeholders, and prioritizes the backlog</p>
            <p><strong>Dev:</strong> Build, test, and refine the product in each sprint</p>
            <p><strong>SM:</strong> Facilitates sprints, removes roadblocks, and ensures Agile principles are followed</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelectRole;
