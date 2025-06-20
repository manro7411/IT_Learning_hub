import { useEffect, useState } from 'react';
import SidebarWidget from '../../widgets/SidebarWidget';
import { useNavigate } from 'react-router-dom';

const choices = [
  'รับฟีเจอร์เข้า Sprint ทันที โดยไม่แจ้งทีม',
  'ขอให้ทีมประชุมทันทีม เพื่อปรับ Sprint Backlog อย่างเร่งด่วน',
  'แจ้งว่าขอเก็บ requirement ไว้ Sprint ถัดไป เพื่อไม่ให้กระทบ Sprint Goal ปัจจุบัน',
  'พูดคุยกับ Stakeholder เพื่ออธิบายกระบวนการ Scrum และเสนอเป็น Backlog Item ถัดไป',
];

const correctAnswerIndex = 2;

const Question = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && selectedIndex === null) {
      setHasTimedOut(true);
      navigate('/answer_false', {
        state: {
          question: 'ในฐานะ Developer, คุณควรจัดการอย่างไร?',
          correctAnswer: choices[correctAnswerIndex],
          selected: null,
          currentIndex: 1,
          total: 5
        }
      });
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, selectedIndex, navigate]);

  useEffect(() => {
    if (selectedIndex !== null) {
      const timeout = setTimeout(() => {
        const isCorrect = selectedIndex === correctAnswerIndex;
        navigate(isCorrect ? '/answer_true' : '/answer_false', {
          state: {
            question: 'ในฐานะ Developer, คุณควรจัดการอย่างไร?',
            correctAnswer: choices[correctAnswerIndex],
            selected: choices[selectedIndex],
            currentIndex: 1,
            total: 5
          }
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [selectedIndex, navigate]);

  const handleChoice = (index: number) => {
    setSelectedIndex(index);
    setIsCorrect(index === correctAnswerIndex);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      <SidebarWidget />

      <main className="flex-1 p-10 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 bg-orange-400 w-12 h-10 rounded-xl shadow-md font-bold text-lg text-white"
        >
          &lt;&lt;
        </button>

        <div className="absolute top-10 right-10">
          <div className="w-16 h-16 rounded-full border-4 border-green-400 text-center text-xl font-bold flex items-center justify-center">
            {timeLeft}
          </div>
        </div>

        <div className="mt-24 bg-gray-50 rounded-xl p-8 shadow-md">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="absolute top-40 left-14 w-12 h-12 rounded-full bg-orange-400 text-white flex items-center justify-center text-xl font-syne">
              1/5 
            </div>
            <h2 className="text-2xl font-syne">
              ในฐานะ Developer, คุณควรจัดการอย่างไร?
            </h2>
          </div>

          <div className="flex flex-col gap-4 font-syne ">
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
                  <div className="bg-orange-400 w-10 h-10 text-2xl rounded-full flex items-center justify-center mr-4 text-bold">
                    {index + 1} 
                  </div>
                  <span className="flex-1 text-lg font-md leading-snug">
                    {choice}
                  </span>
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
