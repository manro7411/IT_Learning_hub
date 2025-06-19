import { useNavigate, useLocation } from 'react-router-dom';
import SidebarWidget from '../../widgets/SidebarWidget';
import TeamImage from '../../assets/team.png';
import QuestionImage from '../../assets/question.png';

const Scenario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRole = location.state?.role || 'unknown';

  return (
    <div className="min-h-screen bg-white flex">
      <SidebarWidget />

      <main className="flex-1 p-10 flex font-sans relative">
        {/* ปุ่มย้อนกลับ */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 bg-orange-400 w-12 h-10 rounded-xl shadow-md font-bold text-lg text-white"
        >
          &lt;&lt;
        </button>

        {/* ซ้าย: หัวข้อ + ปุ่ม */}
        <div className="w-1/3 flex flex-col justify-center items-start pr-8">
          <h1
            className="text-4xl font-bold leading-tight mb-10 text-blue-600"
            style={{
              fontFamily: '"Happy Monkey", cursive',
              textShadow: '2px 2px 6px rgba(0, 0, 255, 0.3)',
            }}
          >
            UNEXPECTED<br />FEATURES<br />REQUEST
          </h1>

          <button
            onClick={() => navigate('/question')}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold px-10 py-2 rounded-full shadow-md"
            style={{ fontFamily: '"Happy Monkey", cursive' }}
          >
            Next
          </button>
        </div>

        {/* ขวา: กล่องเนื้อหา */}
        <div className="w-2/3 flex flex-col gap-6">
          {/* Row 1: รูป + Background */}
          <div className="flex gap-6 items-stretch">
            <div className="flex-1">
              <img
                src={TeamImage}
                alt="Team"
                className="w-full h-full object-cover rounded-xl border-4 border-blue-600"
              />
            </div>
            <div className="flex-1 border-4 border-blue-600 rounded-xl p-6 bg-white shadow-md flex flex-col justify-between">
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
              >
                Background:
              </h2>
              <p className="text-base text-gray-800 font-syne">
                You're halfway through Sprint 3. The team is working on finalizing the online account registration module.
                Suddenly, a business stakeholder approaches and says:
                <br />
                <span className="italic text-gray-600">
                  “ลูกค้ารายใหญ่ขอให้เพิ่มฟีเจอร์การยืนยันตัวตนผ่าน eKYC ใน Sprint นี้เลย ถ้าไม่ทัน จะไม่พอใจมาก...”
                </span>
              </p>
            </div>
          </div>

          {/* Row 2: รูป + Challenge */}
          <div className="flex gap-6 items-stretch">
            <div className="flex-1">
              <img
                src={QuestionImage}
                alt="Question"
                className="w-full h-full object-cover rounded-xl border-4 border-orange-400"
              />
            </div>
            <div className="flex-1 border-4 border-orange-400 rounded-xl p-6 bg-white shadow-md flex flex-col justify-start">
              <h2
                className="text-xl font-bold mb-2"
                style={{ fontFamily: '"Happy Monkey", cursive' }}
              >
                💥Challenge:
              </h2>
              <p className="text-base text-gray-800 font-syne">
                <span className=" text-blue-700">
                  This request was not in the original Sprint Goal or Backlog.
                </span>{' '}
                The team is already committed and has limited capacity left.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scenario;
