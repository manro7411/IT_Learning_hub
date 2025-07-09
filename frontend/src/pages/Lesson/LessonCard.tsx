import { Heart } from "lucide-react";

interface Props {
    title: string;
    category: string;
    thumbnailUrl: string;
    author: string;
    role: string;
    progress?: number; // 0–100, default = 0
    onStart?: () => void;
    onComplete?: () => void;
}

export default function LessonCard({
    title,
    category,
    thumbnailUrl,
    author,
    role,
    progress = 0,
    onStart,
    onComplete,
}: Props) {
    return (
        <div
            className="
                w-64 h-[320px] 
                bg-white rounded-xl shadow-md
                flex flex-col overflow-hidden
            "
        >
            {/* ─── Thumbnail ─── */}
            <div className="relative h-32 w-full">
                <img
                    src={thumbnailUrl || "/placeholder.png"}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
                <button
                    className="
                        absolute top-2 right-2
                        w-7 h-7 bg-white/70 backdrop-blur
                        rounded-full flex items-center justify-center
                        hover:bg-white
                    "
                >
                    <Heart size={14} className="text-blue-600" />
                </button>
            </div>

            {/* ─── Content ─── */}
            <div className="p-3 flex flex-col flex-1">
                <span className="text-[10px] font-semibold text-purple-600 uppercase">
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

                <div className="flex items-center space-x-2 mt-auto">
                    <div className="w-7 h-7 bg-blue-500 rounded-full shrink-0" />
                    <div>
                        <div className="text-xs font-medium">{author}</div>
                        <div className="text-[10px] text-gray-500">{role}</div>
                    </div>
                </div>

                {/* ─── Buttons ─── */}
                <div className="flex justify-between mt-3">
                    <button
                        onClick={onStart}
                        className="text-xs text-blue-600 hover:underline"
                    >
                        {progress > 0 ? "Resume" : "Start"}
                    </button>
                    {progress >= 100 && (
                        <button
                            onClick={onComplete}
                            className="text-xs text-green-600 hover:underline"
                        >
                            Mark as Done
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
