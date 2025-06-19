import { useParams } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";

/* ---------- Types ---------- */
interface Lesson {
    id: number;
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

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);

    /* ── Load Lesson ── */
    useEffect(() => {
        axios
            .get<Lesson>(`http://localhost:8080/learning/${id}`)
            .then((res) => setLesson(res.data))
            .catch(() => alert("Lesson not found"))
            .finally(() => setLoading(false));
    }, [id]);

    /* ── Video progress tracking ── */
    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        const pct = (v.currentTime / v.duration) * 100;
        setProgress(pct);
    };

    /* ── Sync progress to backend ── */
    useEffect(() => {
        if (!lesson || !token) return;

        const timer = setInterval(() => {
            if (progress > 0) {
                const data = { percent: Math.floor(progress) };

                console.log("📤 PUT /progress", lesson.id, data);

                axios
                    .put(`http://localhost:8080/progress/${lesson.id}`, data, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    })
                    .then(() => console.log("✅ Progress saved"))
                    .catch((err) => console.error("❌ PUT failed:", err));
            }
        }, 10_000);

        return () => clearInterval(timer);
    }, [progress, lesson, token]);

    /* ── UI ── */
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

                    {/* ▶ Schedule (Mock) */}
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
        </div>
    );
};

export default LessonDetailPage;
