import { useState } from "react";

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
        options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

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
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">🧠 Quick Quiz</h1>

            {showResult ? (
                <div className="text-center">
                    <p className="text-lg font-semibold">Your Score: {score} / {sampleQuestions.length}</p>
                    <button
                        onClick={resetQuiz}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Restart Quiz
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-gray-700 font-medium mb-2">
                        Question {currentIndex + 1} of {sampleQuestions.length}
                    </p>
                    <h2 className="text-lg font-semibold mb-4">{currentQuestion.question}</h2>
                    <ul className="space-y-3">
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

                    <div className="mt-6">
                        <button
                            onClick={handleNext}
                            disabled={!selectedOption}
                            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {currentIndex + 1 === sampleQuestions.length ? "Finish" : "Next"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default QuizPage;
