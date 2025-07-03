import React from "react";

interface Choice {
  id: string;
  choiceText: string;
  isCorrect: boolean;
}

interface QuestionProps {
  type: string;
  choices?: Choice[];
  selectedOption: string | null;
  onSelect: (value: string) => void;
}

const QuestionWidget: React.FC<QuestionProps> = ({
  type,
  choices = [],
  selectedOption,
  onSelect,
}) => {
  switch (type) {
    case "TRUE_FALSE":
      return (
        <div className="flex flex-col gap-4">
          {["true", "false"].map((val) => (
            <button
              key={val}
              onClick={() => onSelect(val)}
              className={`px-4 py-2 border rounded text-left ${
                selectedOption === val
                  ? "bg-blue-200 font-semibold"
                  : "hover:bg-blue-50"
              }`}
            >
              {val.toUpperCase()}
            </button>
          ))}
        </div>
      );

    case "MULTIPLE":
    case "MULTIPLE_CHOICE":
      return (
        <div className="flex flex-col gap-4">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onSelect(choice.choiceText)}
              className={`px-4 py-2 border rounded text-left ${
                selectedOption === choice.choiceText
                  ? "bg-blue-200 font-semibold"
                  : "hover:bg-blue-50"
              }`}
            >
              {choice.choiceText}
            </button>
          ))}
        </div>
      );

    case "FILL_IN_THE_BLANK":
      return (
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Fill in your answer:
          </label>
          <input
            type="text"
            className="border px-4 py-2 rounded w-full"
            placeholder="Type your answer..."
            value={selectedOption ?? ""}
            onChange={(e) => onSelect(e.target.value)}
          />
        </div>
      );

    case "ESSAY":
      return (
        <div>
          <label className="block text-sm text-gray-600 mb-2">Your response:</label>
          <textarea
            className="border px-4 py-2 rounded w-full min-h-[100px]"
            placeholder="Write your detailed answer here..."
            value={selectedOption ?? ""}
            onChange={(e) => onSelect(e.target.value)}
          />
        </div>
      );

    default:
      return <p className="text-gray-500 italic">Unsupported question type</p>;
  }
};

export default QuestionWidget;
