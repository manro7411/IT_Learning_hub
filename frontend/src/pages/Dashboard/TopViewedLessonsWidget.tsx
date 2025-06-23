import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface TopLesson {
    id: string;
    title: string;
    category: string;
    thumbnailUrl?: string;
    viewers?: number;
}
const API = "http://localhost:8080/learning";

const TopViewedLessonsWidget = () => {
    const [topLessons, setTopLessons] = useState<TopLesson[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .get(`${API}/top-viewed?limit=3`)
            .then((res) => setTopLessons(res.data))
            .catch(console.error);
    }, []);

    const handleLessonClick = (id: string) => {
        navigate(`/lesson/${id}`);
    };
    return (
        <section>
            <h2 className="text-xl font-semibold mb-3">🔥 The most Effective courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topLessons.map((lesson, idx) => (
                    <div
                        key={lesson.id}
                        className="relative bg-white rounded-xl shadow hover:shadow-md border border-gray-100 cursor-pointer flex flex-col overflow-hidden"
                        onClick={() => handleLessonClick(lesson.id)}
                    >
            <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
              #{idx + 1}
            </span>
                        {lesson.thumbnailUrl ? (
                            <div className="h-28 bg-gray-100 w-full">
                                <img
                                    src={lesson.thumbnailUrl}
                                    alt={lesson.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="h-28 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                No Image
                            </div>
                        )}

                        <div className="p-4 flex flex-col flex-1">
              <span className="text-[10px] font-semibold text-purple-600 uppercase">
                {lesson.category}
              </span>
                            <h3 className="text-sm font-semibold mt-1 line-clamp-2">
                                {lesson.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default TopViewedLessonsWidget;
