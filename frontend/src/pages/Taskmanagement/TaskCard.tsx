import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  lessonId: string;
  category: string;
  thumbnailUrl: string;
  assignee: string;
  role: string;
  progress?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

const TaskCard = ({
  title,
  category,
  thumbnailUrl,
  progress = 0,
  lessonId,
}: Props) => {
  return (
    <Link to={`/lesson/${lessonId}`}>
      <div className="w-64 h-[320px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
        <div className="relative h-32 w-full">
          <img
            src={thumbnailUrl || "/placeholder.png"}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
          <button
            className="absolute top-2 right-2 w-7 h-7 bg-white/70 backdrop-blur rounded-full flex items-center justify-center hover:bg-white"
          >
            <CheckCircle size={14} className="text-green-600" />
          </button>
        </div>

        <div className="p-3 flex flex-col flex-1">
          <span className="text-[10px] font-semibold text-blue-600 uppercase">
            {category}
          </span>

          <h3 className="text-sm font-semibold leading-tight mt-[2px] line-clamp-2">
            {title}
          </h3>

          <div className="h-1 bg-gray-200 rounded-full mt-3 mb-2">
            <div
              className="h-full bg-blue-600 rounded-full transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
