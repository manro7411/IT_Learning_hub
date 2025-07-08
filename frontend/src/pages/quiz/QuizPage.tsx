/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useContext } from "react";
import SidebarWidget from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import { AuthContext } from "../../Authentication/AuthContext";
import { Navigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const sampleQuestions = [
  {
    id: 1,
    question: "Which of the following roles is not part of a typical Scrum team?",
    options: ["Product Owner", "Scrum Master", "Project sponsor", "Development Team"],
    answer: "Project sponsor",
  },
  {
    id: 2,
    question: "What is the primary purpose of a Sprint Review?",
    options: [
      "To plan the next Sprint",
      "To demonstrate the work done during the Sprint",
      "To review team performance",
      "To update the product backlog",
    ],
    answer: "To demonstrate the work done during the Sprint",
  },
  {
    id: 3,
    question: "What is a key characteristic of Agile methodologies?",
    options: [
      "Extensive documentation",
      "Fixed scope and requirements",
      "Iterative development",
      "Long release cycles",
    ],
    answer: "Iterative development",
  },
  {
    id: 4,
    question: "In Agile, what does 'velocity' refer to?",
    options: [
      "The speed of team members",
      "The amount of work completed in a Sprint",
      "The time taken to complete a project",
      "The number of meetings held",
    ],
    answer: "The amount of work completed in a Sprint",
  },
];

const QuizPageStyled = () => {
  const { t } = useTranslation("userlesson");

  const { user, token: ctxToken } = useContext(AuthContext);
  const token =
    ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const displayName = user?.name || user?.upn || "User";
  if (!token) return <Navigate to="/" replace />;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = sampleQuestions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleOptionSelect = (opt: string) => {
    setSelectedOption(opt);
    setIsCorrect(opt === currentQuestion.answer);
  };

  const handleContinue = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setTimeLeft(20);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar (disabled until quiz finishes) */}
      <div className={`w-64 hidden lg:block ${!quizFinished ? "pointer-events-none opacity-50" : ""}`}>
        <SidebarWidget />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-16 py-10 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('welcome', { name: displayName })}</h1>
        <p className="text-sm text-gray-400 mb-6">{t('greeting')}</p>

        {!quizFinished ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt, idx) => (
                <div
                  key={opt}
                  onClick={() => handleOptionSelect(opt)}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 cursor-pointer shadow-sm transition 
                    ${
                      selectedOption === opt
                        ? isCorrect
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500"
                        : "border-blue-400 hover:bg-blue-50"
                    }`}
                >
                  <span className="text-base text-gray-800 font-medium">{opt}</span>
                  <span className="text-white font-bold bg-blue-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                </div>
              ))}
            </div>

          
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 {t('complete')}</h2>
            <p className="text-gray-600">{t('message2')}</p>
            <p className="text-gray-500 mt-2">{t('message3')}</p>
          </div>
        )}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
        <div className="flex items-center justify-center w-16 h-16 border-4 border-blue-400 rounded-full text-blue-600 text-lg font-bold">
            {timeLeft}
        </div>
        <button
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700"
            disabled={!selectedOption}
            onClick={handleContinue}
        >
    {currentQuestionIndex < sampleQuestions.length - 1 ? "Continue" : "Finish Quiz" }
  </button>
</div>
      </div>
      <div className="w-64 hidden lg:block">
        <CalendarWidget />
      </div>
    </div>
  );
};

export default QuizPageStyled;