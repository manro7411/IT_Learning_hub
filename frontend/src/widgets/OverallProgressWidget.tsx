interface OverallProgressWidgetProps {
  progress: number;
}

const OverallProgressWidget = ({ progress }: OverallProgressWidgetProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex flex-col items-center">
      <div className="text-sm font-medium text-gray-600 mb-2">Overall Progress</div>
      <div className="relative">
        <svg className="w-20 h-20">
          <circle
            className="text-gray-300"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="32"
            cx="40"
            cy="40"
          />
          <circle
            className="text-blue-500"
            strokeWidth="8"
            strokeDasharray={`${progress * 2.01}, 201`}
            strokeDashoffset="0"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="32"
            cx="40"
            cy="40"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-800">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default OverallProgressWidget;