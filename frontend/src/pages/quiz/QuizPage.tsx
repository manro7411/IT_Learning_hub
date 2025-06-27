import { useState, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext";
import { Navigate } from "react-router-dom";

import SidebarWidget from "../../widgets/SidebarWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Marketing Language",
      "Hyper Tool Markup Language",
    ],
    answer: "Hyper Text Markup Language",
  },
  {
    id: 2,
    question: "Which company developed React?",
    options: ["Google", "Microsoft", "Facebook", "Apple"],
    answer: "Facebook",
  },
  {
    id: 3,
    question: "What is the default port for React dev server?",
    options: ["3000", "8080", "5000", "4200"],
    answer: "3000",
  },
];

const QuizPage = () => {
  const { user, token: ctxToken } = useContext(AuthContext);
  const token =
    ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const displayName = user?.name || user?.upn || "User";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!token) return <Navigate to="/" replace />;

  const currentQuestion = sampleQuestions[currentIndex];

  const handleNext = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < sampleQuestions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <SidebarWidget />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              🧠 Quiz Time, {displayName}
            </h1>
            <NotificationWidget />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                {showResult ? (
                  <div className="text-center space-y-4">
                    <p className="text-xl font-semibold text-green-700">
                      🎉 You scored {score} / {sampleQuestions.length}
                    </p>
                    <button
                      onClick={resetQuiz}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Restart Quiz
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 text-sm mb-2">
                      Question {currentIndex + 1} of {sampleQuestions.length}
                    </p>
                    <h2 className="text-lg font-semibold mb-4">
                      {currentQuestion.question}
                    </h2>
                    <ul className="space-y-2">
                      {currentQuestion.options.map((option) => (
                        <li key={option}>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="option"
                              value={option}
                              checked={selectedOption === option}
                              onChange={() => setSelectedOption(option)}
                              className="accent-blue-600"
                            />
                            <span>{option}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 text-right">
                      <button
                        onClick={handleNext}
                        disabled={!selectedOption}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {currentIndex + 1 === sampleQuestions.length
                          ? "Finish"
                          : "Next"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="order-1 xl:order-2">
              <div className="space-y-6 mt-4 xl:mt-0">
                <CalendarWidget />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default QuizPage;
