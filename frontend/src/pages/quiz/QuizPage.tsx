/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import SidebarWidget from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import { AuthContext } from "../../Authentication/AuthContext";
import QuestionWidget from "./QuestionWidget";

// Types
interface LearningContent {
  title: string;
  description: string;
  thumbnailUrl: string;
}

interface Choice {
  id: string;
  choiceText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  type: string;
  points: number;
  learningContent: LearningContent;
  choices?: Choice[];
}

const QuizPageStyled = () => {
  const { id: learningContentId } = useParams<{ id: string }>();
  const { user, token: ctxToken } = useContext(AuthContext);
  const token =
    ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const displayName = user?.name || user?.upn || "User";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; selected: string }[]>([]);

  // Fetch questions
  useEffect(() => {
    if (!learningContentId) return;

    fetch(`http://localhost:8080/questions/by-learning/${learningContentId}`)
      .then(async (res) => {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          const formatted = Array.isArray(parsed) ? parsed : [parsed];
          setQuestions(formatted);
        } catch (err) {
          console.error("❌ JSON parse error:", text);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Failed to fetch questions:", error);
        setLoading(false);
      });
  }, [learningContentId]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (opt: string) => {
    setSelectedOption(opt);
  };

  const handleContinue = () => {
    const current = questions[currentQuestionIndex];
    const isCorrect = current.choices?.some(
      (c) => c.choiceText === selectedOption && c.isCorrect
    );

    setAnswers((prev) => [
      ...prev,
      { questionIndex: currentQuestionIndex, selected: selectedOption || "" },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + current.points);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(20);
    } else {
      setQuizFinished(true);
    }
  };

  // Guards
  if (!token) return <Navigate to="/" replace />;
  if (loading) return <div className="p-10 text-gray-500">Loading questions...</div>;
  if (!questions.length || !currentQuestion)
    return <div className="p-10 text-red-500">No questions found.</div>;

  return (
    <div className="flex min-h-screen bg-white">

      <div
        className={`w-64 hidden lg:block ${
          !quizFinished ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <SidebarWidget />
      </div>

      {/* Main Content */}
      <div className="flex-1 px-16 py-10 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {displayName}</h1>
        <p className="text-sm text-gray-400 mb-6">Let’s get started!</p>

        {!quizFinished ? (
          <div>
            <h2 className="text-xl font-bold mb-6">
              {currentQuestion.questionText}
            </h2>
            <div className="mb-6">
              <p className="text-sm text-gray-500">ประเภท: {currentQuestion.type}</p>
              <p className="text-sm text-gray-500">คะแนน: {currentQuestion.points}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex items-start gap-4">
              <img
                src={currentQuestion.learningContent.thumbnailUrl}
                alt={currentQuestion.learningContent.title}
                className="w-32 h-20 object-cover rounded shadow"
              />
              <div>
                <h4 className="text-md font-bold text-blue-700">
                  {currentQuestion.learningContent.title}
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {currentQuestion.learningContent.description}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <QuestionWidget
                type={currentQuestion.type}
                choices={currentQuestion.choices}
                selectedOption={selectedOption}
                onSelect={handleOptionSelect}
              />
            </div>
          </div>
        ) : (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Quiz Completed!</h2>
            <p className="text-gray-600 mb-2">You scored: <strong>{score}</strong> point(s)</p>
            <p className="text-gray-500">Thanks for participating!</p>
          </div>
        )}

        {/* Bottom Bar */}
        {!quizFinished && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
            <div className="flex items-center justify-center w-16 h-16 border-4 border-blue-400 rounded-full text-blue-600 text-lg font-bold">
              {timeLeft}
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700"
              onClick={handleContinue}
              disabled={!selectedOption}
            >
              {currentQuestionIndex < questions.length - 1
                ? "Continue"
                : "Finish Quiz"}
            </button>
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="w-64 hidden lg:block">
        <CalendarWidget />
      </div>
    </div>
  );
};

export default QuizPageStyled;
