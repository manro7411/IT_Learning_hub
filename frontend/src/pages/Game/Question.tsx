import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import SidebarWidget from '../../widgets/SidebarWidget';

import devQuestion from './Role_Question/devQuestion';
import smQuestion from './Role_Question/smQuestion';
import poQuestion from './Role_Question/poQuestion';
import type { QuestionItem } from './types/Question';

type Role = 'dev' | 'po' | 'sm';

const questionsByRole: Record<Role, QuestionItem[][]> = {
  dev: devQuestion,
  po: poQuestion,
  sm: smQuestion,
};

const Question = () => {
  const { role, scenarioIndex } = useParams<{ role: Role; scenarioIndex: string }>();
  const scenarioIdx = parseInt(scenarioIndex || '0');
  const navigate = useNavigate();
  const location = useLocation();

  const { currentIndex: passedIndex = 0, correctCount: passedCorrect = 0 } = location.state || {};
  const [currentIndex] = useState(passedIndex);
  const [correctCount] = useState(passedCorrect);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  const questionSet = (role && questionsByRole[role]?.[scenarioIdx]) || [];
  
  const currentQuestion = questionSet[currentIndex];
  // const total = questionsByRole[role]?.flat().length || 1;


  useEffect(() => {
    if (!currentQuestion) {
      navigate(`/scenario/${role}/${scenarioIdx + 1}`);
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
  if (timeLeft <= 0 && selectedIndex === null && currentQuestion) {
   
    // const totalQuestions = questionsByRole[role]?.flat().length || 1;

    navigate('/answer_false', {
      state: {
        question: currentQuestion.question,
        correctAnswer: currentQuestion.choices[currentQuestion.correctAnswerIndex],
        selected: null, 
        currentIndex: parseInt(scenarioIndex || '0', 10) + 1,
        correctCount,
        // total: totalQuestions,
        role,
        scenarioIndex,
      },
    });
  }
}, [timeLeft, selectedIndex]);


  

  useEffect(() => {
    if (selectedIndex !== null) {
      const timeout = setTimeout(() => {
        // const correct = selectedIndex === currentQuestion.correctAnswerIndex;
        // const nextCorrect = correct ? correctCount + 1 : correctCount;
        // const total = questionsByRole[role]?.length || 1;

        navigate(isCorrect ? '/answer_true' : '/answer_false', {
          state: {
            question: currentQuestion.question,
            correctAnswer: currentQuestion.choices[currentQuestion.correctAnswerIndex],
            selected: currentQuestion.choices[selectedIndex],
            currentIndex: currentIndex + 1,
            correctCount: isCorrect ? correctCount + 1 : correctCount,
            // total,
            role,
            scenarioIndex,
          },
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [selectedIndex]);

  const handleChoice = (index: number) => {
    setSelectedIndex(index);
    setIsCorrect(index === currentQuestion.correctAnswerIndex);
  };

  if (!currentQuestion) return null;

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

        {/* Timer */}
        <div className="absolute top-10 right-10">
          <div className="w-16 h-16 rounded-full border-4 border-green-400 text-center text-xl font-bold flex items-center justify-center">
            {timeLeft}
          </div>
        </div>

        {/* Question */}
        <div className="mt-24 bg-gray-50 rounded-xl p-8 shadow-md">
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="absolute top-40 left-14 w-12 h-12 rounded-full bg-orange-400 text-white flex items-center justify-center text-xl font-syne">
              {/* {parseInt(scenarioIndex || '0', 10) + 1}/{total} */}
            </div>
            <h2 className="text-2xl font-syne text-center">
              {currentQuestion?.question}
            </h2>
          </div>

          <div className="flex flex-col gap-4 font-syne">
            {currentQuestion?.choices.map((choice, index) => {
              // const isSelected = selectedIndex === index;
              const showResult = selectedIndex !== null;

              let borderColor = 'border-transparent';
              if (showResult) {
                if (index === selectedIndex) {
                  borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
                } else if (index === currentQuestion.correctAnswerIndex) {
                  borderColor = 'border-green-500';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className={`flex items-center text-white bg-blue-600 rounded-full px-6 py-3 text-left shadow-md border-4 ${borderColor}`}
                  disabled={selectedIndex !== null}
                >
                  <div className="bg-orange-400 w-10 h-10 text-2xl rounded-full flex items-center justify-center mr-4 font-bold">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-lg font-medium leading-snug">
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
