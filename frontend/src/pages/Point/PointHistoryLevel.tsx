import { Gift } from "lucide-react";
import { getLevelInfo } from "./levelUtils";
import { useNavigate } from "react-router-dom";

type ScoreProps = {
  overallScore: number;
};

const PointhistoryLevel = ({ overallScore }: ScoreProps) => {
  const { label, progress ,current,max} = getLevelInfo(overallScore);
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-indigo-100 rounded-xl p-4 flex items-center space-x-4 shadow" onClick={()=> navigate('/point/history')}>
        <Gift className="text-indigo-500 w-8 h-8" />
        <span className="text-lg font-medium text-indigo-700">History</span>
      </div>
      <div className="bg-indigo-100 rounded-xl p-4 shadow">
        <div className="text-sm text-gray-600">Level</div>
        <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          {label}
        </div>
        <div className="text-xs text-gray-500">Progress to next level</div>
        <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-xs text-gray-500 mt-1">
           {max-current} to go!
        </div>
      </div>
    </div>
  );
};
export default PointhistoryLevel;
