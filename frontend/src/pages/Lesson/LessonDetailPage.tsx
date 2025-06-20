import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";

interface Lesson {
    id: string;
    title: string;
    description: string;
    category: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    authorName?: string;
}

const fallbackVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

const LessonDetailPage = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showQuiz, setShowQuiz] = useState(false);

    useEffect(() => {
        axios
            .get<Lesson>(`http://localhost:8080/learning/${id}`)
            .then((res) => setLesson(res.data))
            .catch(() => alert("Lesson not found"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        const pct = (v.currentTime / v.duration) * 100;
        setProgress(pct);
    };

    useEffect(() => {
        if (!lesson || !token) return;

        const timer = setInterval(() => {
            if (progress > 0 && progress < 100) {
                const data = { percent: Math.floor(progress) };

                axios
                    .put(`http://localhost:8080/progress/${lesson.id}`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                    // .then(() => console.log("✅ Progress saved"))
                    .catch((err) => console.error("❌ PUT failed:", err));
            }
        }, 0);
        // 10_000

        if (progress >= 100 && !showQuiz) {
            setShowQuiz(true);
        }

        return () => clearInterval(timer);
    }, [progress, lesson, token, showQuiz]);

    if (loading || !lesson) {
        return <div className="p-6 text-gray-400">⏳ Loading lesson…</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* ▶ Video & Details */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="w-full rounded-xl overflow-hidden shadow">
                            <video
                                ref={videoRef}
                                controls
                                onTimeUpdate={handleTimeUpdate}
                                poster={lesson.thumbnailUrl}
                                className="w-full h-auto bg-black"
                                src={lesson.videoUrl || fallbackVideo}
                            />
                            <div className="h-1 bg-gray-300">
                                <div
                                    className="h-full bg-blue-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <section className="bg-white rounded-xl shadow p-6 space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
                            <span className="text-xs font-semibold uppercase text-purple-600">
                {lesson.category}
              </span>

                            <p className="text-gray-700">{lesson.description}</p>
                            <p className="text-sm text-gray-500">Author: {lesson.authorName || "Unknown"}</p>
                            <p className="text-sm text-gray-500">Progress: {Math.floor(progress)}%</p>
                        </section>
                    </div>

                    {/* ▶ Schedule */}
                    <aside className="space-y-6 mt-4 xl:mt-0">
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-sm font-semibold mb-4 text-gray-700">Schedule</h3>
                            {["What is Scrum?", "Scrum Events", "Scrum Artifacts", "Agile Estimation"].map(
                                (item, i) => (
                                    <div key={i} className="flex items-start space-x-2 mb-4">
                                        <div className="w-2 h-2 mt-1 bg-blue-600 rounded-full" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{item}</div>
                                            <div className="text-xs text-gray-500">Tika Sarak S.Pd</div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </aside>
                </div>
            </main>

            {/* 🎉 Popup Quiz */}
            {showQuiz && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
                        <h2 className="text-xl font-bold mb-4">🎉 You finished the lesson!</h2>
                        <p className="text-gray-700 mb-6">Take a short quiz to test your knowledge.</p>
                        <button
                            onClick={() => {
                                setShowQuiz(false);
                                navigate(`/quiz/${lesson.id}`);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            Start Quiz
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonDetailPage;
