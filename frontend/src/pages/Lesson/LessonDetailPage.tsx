import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";

interface Lesson {
    id: number;
    title: string;
    description: string;
    category: string;
    thumbnailUrl?: string;
    authorName?: string;
}

const LessonDetailPage = () => {
    const { id } = useParams();
    const [lesson, setLesson] = useState<Lesson | null>(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/learning/${id}`)
            .then((res) => setLesson(res.data))
            .catch(() => alert("Lesson not found"));
    }, [id]);

    if (!lesson) return <div className="p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left 2/3 content */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Banner */}
                        <div className="relative w-full rounded-xl overflow-hidden shadow-md">
                            <img
                                src={lesson.thumbnailUrl || "/placeholder.png"}
                                alt={lesson.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white p-4">
                                <h1 className="text-xl font-bold">{lesson.title}</h1>
                                <p className="text-sm">{lesson.category}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow p-6 space-y-4">
                            <div className="text-lg font-semibold text-gray-800">About This Lesson</div>
                            <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
                            <p className="text-sm text-gray-500">
                                Author: {lesson.authorName || "Unknown"}
                            </p>
                        </div>

                        {/* My Classes (mock) */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Classes</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white p-4 rounded-xl shadow space-y-2">
                                        <div className="font-semibold text-sm text-gray-800">
                                            Agile vs. Hybrid Approaches
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            When to use pure Agile, Waterfall, or a mix (real-world decision making).
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                                            <span>👤 Firstname Lastname</span>
                                            <span>⏱ 3 Hours</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 1/3 Schedule */}
                    <div className="space-y-6 mt-4 xl:mt-0">
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-sm font-semibold mb-4 text-gray-700">Schedule</h3>
                            {["What is Scrum?", "Scrum Events", "Scrum Artifacts", "Agile Estimation"].map(
                                (item, i) => (
                                    <div key={i} className="flex items-start space-x-2 mb-4">
                                        <div className="w-2 h-2 mt-1 bg-blue-600 rounded-full"></div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{item}</div>
                                            <div className="text-xs text-gray-500">Tika Sarak S.Pd</div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LessonDetailPage;
