import SidebarWidget from '../../widgets/SidebarWidget';
import { useLocation, useNavigate } from 'react-router-dom';
import WrongImage from '../../assets/wrong.png'; 
import { motion } from 'framer-motion';

const AnswerFalse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { question, selected, correctAnswer, currentIndex = 1, total = 5 } = location.state || {};

  const handleNext = () => {
    navigate('/game'); 
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <SidebarWidget />

      <main className="flex-1 p-10 flex flex-col items-center relative">
        {/* Question+Answer */}
        <div className="w-full max-w-5xl bg-gray-50 rounded-xl shadow-xl p-16 pb-60 text-center relative">
          <h2 className="text-2xl  mb-8 font-syne">
            {question}
          </h2>

          {/* Wrong */}
          <div className="flex items-center justify-center gap-6 mb-16 mt-28">
            <img src={WrongImage} alt="Wrong" className="w-16 h-16" />
            <motion.div
              className="text-4xl font-bold text-black font-syne"
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              wrong
            </motion.div>
          </div>

          {/* Correct */}
          <div className="absolute bottom-8 left-0 w-full px-16 text-black text-base text-left  ">  
            <div className="text-xl font-semibold font-syne">Correct Answer:</div>
            <div className="text-blue-600 text-lg font-syne mt-2">
              {correctAnswer }
            </div>
          </div>
        </div>
        
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

export default AnswerFalse; 