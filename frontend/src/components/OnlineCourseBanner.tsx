import { useState } from 'react';
import bgImage from '../assets/backgroundcourse.png';
import instructionImg from '../assets/instructiondashboard.png'

const OnlineCourseBanner = () => {
  const [showInstruction,setShowInstruction] = useState(false);
  return (
    <div
      className="rounded-xl p-6 text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="mb-4">
        <div className="text-sm font-light">ONLINE COURSE</div>
        <div className="text-2xl font-semibold mt-1">
          Your journey to smarter learning starts here.
        </div>
      </div>
      <button
        className="bg-orange-400 hover:bg-orange-500 text-white font-medium px-4 py-2 rounded-full"
        onClick={() => setShowInstruction(true)}
      >
        Read More ▶
      </button>

      {showInstruction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-xl p-8 max-w-4xl w-full shadow-lg relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowInstruction(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2 justify-center">How to use this course</h2>
           <img src={instructionImg} alt="Instruction" className="w-full rounded-lg mb-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineCourseBanner;
