import SidebarWidget from '../../widgets/SidebarWidget';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckImage from '../../assets/check.png'; 
import { motion } from 'framer-motion';

const AnswerTrue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    question,
    selected,
    correctAnswer,
    currentIndex = 1,
    total = 5,
  } = location.state || {};

  const handleNext = () => {
    navigate('/next-question'); 
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <SidebarWidget />

      <main className="flex-1 p-10 flex flex-col items-center relative">
        {/* Question+Answer*/}
        <div className="w-full max-w-5xl bg-gray-50 rounded-xl shadow-xl p-16 text-center relative flex flex-col justify-between" style={{ minHeight: '560px' }}>
            <div>
                <h2 className="text-2xl  mb-8 font-syne">
                    {question}
                </h2>

                <div className="inline-block bg-blue-600 text-white text-lg px-6 py-3 rounded-full mb-10 font-syne">
                    {selected}
                </div>

            {/* Correct */}
            <div className="flex items-center justify-center gap-6 mb-12">
                <img src={CheckImage} alt="Correct" className="w-16 h-16" />
                <motion.div
                    className="text-4xl font-bold text-black font-syne"
                    initial={{ scale: 0, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                    correct
                </motion.div>
            </div>
        </div>

            {/* Progress */}
            <div className="text-black text-base">
                <div className="mb-2 font-semibold">
                    {currentIndex} CORRECT ANSWERS OUT OF {total}
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                    className="h-3 bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${(currentIndex / total) * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* ปุ่ม Next */}
        <div className="absolute bottom-10 right-10">
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl font-happy px-12 py-4 rounded-xl shadow-md"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default AnswerTrue;
