import { useState, useEffect, useContext } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarWidget from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";
import QuestionWidget from "./QuestionWidget";

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

interface Progress {
  lessonId: string;
  percent: number;
  score: number;
  attempts: number;
  maxAttempts: number;
}

const QuizPageStyled = () => {
  const { id: learningContentId } = useParams<{ id: string }>();
  const { user, token: ctxToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const displayName = user?.name || user?.upn || "User";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);

  const fetchProgress = async () => {
    try {
      const res = await axios.get<Progress[]>("http://localhost:8080/user/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const progress = res.data.find((p) => p.lessonId === learningContentId);
      if (!progress) return;
      setAttempts(progress.attempts || 0);
      setMaxAttempts(progress.maxAttempts || 1);
      if ((progress.attempts || 0) >= (progress.maxAttempts || 1)) {
        setHasTakenQuiz(true);
      }
    } catch (err) {
      console.error("❌ Failed to check progress:", err);
    }
  };

  useEffect(() => {
    if (!learningContentId || !token) return;
    fetchProgress();
  }, [learningContentId, token]);

  useEffect(() => {
    if (!learningContentId) return;
    axios.get<Question[]>(`http://localhost:8080/questions/by-learning/${learningContentId}`)
      .then((res) => setQuestions(res.data))
      .catch((error) => console.error("❌ Failed to fetch questions:", error))
      .finally(() => setLoading(false));
  }, [learningContentId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (!showSummary) return;
    const timeout = setTimeout(() => navigate("/lesson"), 5000);
    return () => clearTimeout(timeout);
  }, [showSummary, navigate]);

  const submitScore = async (finalScore: number) => {
    try {
      await axios.put(`http://localhost:8080/user/progress/${learningContentId}/submit-score`, { score: finalScore }, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log(`✅ Score submitted: ${finalScore}`);
    } catch (error) {
      console.error("❌ Error submitting score:", error);
    }
  };

  const handleOptionSelect = (opt: string) => setSelectedOption(opt);

  const handleContinue = async () => {
    const current = questions[currentQuestionIndex];
    const isCorrect = current.choices?.some(c => c.choiceText === selectedOption && c.isCorrect);
    if (isCorrect) setScore((prev) => prev + current.points);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTimeLeft(20);
    } else {
      await submitScore(score);
      setShowSummary(true);
    }
  };

  if (!token) return <Navigate to="/" replace />;
  if (loading) return <div className="p-10 text-gray-500">Loading questions...</div>;

  if (hasTakenQuiz)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-center p-10">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Quiz Unavailable</h2>
          <p className="text-gray-600 mb-4">You have used {attempts} / {maxAttempts} attempts.</p>
          <button onClick={() => navigate("/lesson")} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Lessons
          </button>
        </div>
      </div>
    );

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div className="p-10 text-red-500">No questions found.</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <div className={`w-64 hidden lg:block ${showSummary ? "" : "pointer-events-none opacity-50"}`}>
        <SidebarWidget />
      </div>

      <div className="flex-1 px-16 py-10 relative">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {displayName}</h1>
        <p className="text-sm text-gray-400 mb-6">Let’s get started!</p>

        {showSummary ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Quiz Completed!</h2>
            <p className="text-gray-600 mb-2">You scored: <strong>{score}</strong> point(s)</p>
            <p className="text-gray-500">Redirecting to lessons...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6">{currentQuestion.questionText}</h2>
            <p className="text-sm text-gray-500 mb-4">ประเภท: {currentQuestion.type} | คะแนน: {currentQuestion.points}</p>
            <QuestionWidget
              type={currentQuestion.type}
              choices={currentQuestion.choices}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
            />
          </>
        )}

        {!showSummary && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-between items-center px-16">
            <div className="flex items-center justify-center w-16 h-16 border-4 border-blue-400 rounded-full text-blue-600 text-lg font-bold">
              {timeLeft}
            </div>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700"
              onClick={handleContinue}
              disabled={!selectedOption}
            >
              {currentQuestionIndex < questions.length - 1 ? "Continue" : "Finish Quiz"}
            </button>
          </div>
        )}
      </div>

      <div className="w-64 hidden lg:block">
        {/* <CalendarWidget /> */}
      </div>
    </div>
  );
};

export default QuizPageStyled;
