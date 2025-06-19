import { useState } from 'react';
import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom';

const choices = [
  'รับฟีเจอร์เข้า Sprint ทันที โดยไม่แจ้งทีม',
  'ขอให้ทีมประชุมทันทีม เพื่อปรับ Sprint Backlog อย่างเร่งด่วน',
  'แจ้งว่าขอเก็บ requirement ไว้ Sprint ถัดไป เพื่อไม่ให้กระทบ Sprint Goal ปัจจุบัน',
  'พูดคุยกับ Stakeholder เพื่ออธิบายกระบวนการ Scrum และเสนอเป็น Backlog Item ถัดไป',
];

const correctAnswerIndex = 2; // ข้อที่ 3 ตอบถูก

const Question = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleChoice = (index: number) => {
    setSelectedIndex(index);
    setIsCorrect(index === correctAnswerIndex);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <SidebarWidget />

      <main className="flex-1 p-10">
        {/* Back + Timer */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-orange-300 w-12 h-12 rounded-full shadow-md font-bold text-xl"
          >
            &lt;&lt;
          </button>
          <div className="w-12 h-12 rounded-full border-4 border-green-400 text-center text-lg font-bold flex items-center justify-center">
            10
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-gray-50 rounded-xl p-8 shadow-md">
          <div className="text-orange-500 text-xl font-bold mb-2 font-syne w-12 h-12 rounded-full ">1/5</div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            ในฐานะ Developer, คุณควรจัดการอย่างไร?
          </h2>

          <div className="flex flex-col gap-4">
            {choices.map((choice, index) => {
              const isSelected = selectedIndex === index;
              const showResult = selectedIndex !== null;

              let borderColor = 'border-transparent';
              if (showResult) {
                if (index === selectedIndex) {
                  borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
                } else if (index === correctAnswerIndex) {
                  borderColor = 'border-green-500';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className={`flex items-center text-white bg-blue-600 rounded-full px-6 py-3 text-left shadow-md border-4 ${borderColor}`}
                >
                  <div className="bg-orange-400 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <span className="flex-1">{choice}</span>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Question;
