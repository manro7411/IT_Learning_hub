import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";

interface Lesson {
    id: number;
    title: string;
    description: string;
    category: string;
    thumbnailUrl?: string;
    videoUrl?: string;              // 👈 เพิ่ม field นี้
    authorName?: string;
}

const fallbackVideo =
    "https://www.w3schools.com/html/mov_bbb.mp4"; // วิดีโอตัวอย่าง

const LessonDetailPage = () => {
    const { id } = useParams();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [progress, setProgress] = useState(0); // 0-100
    const [loading, setLoading] = useState(true);

    /* ───── โหลด Lesson ───── */
    useEffect(() => {
        axios
            .get<Lesson>(`http://localhost:8080/learning/${id}`)
            .then((res) => setLesson(res.data))
            .catch(() => alert("Lesson not found"))
            .finally(() => setLoading(false));
    }, [id]);

    /* ───── คำนวณ Progress ───── */
    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        const pct = (v.currentTime / v.duration) * 100;
        setProgress(pct);
    };

    /* ───── ส่ง progress ไป backend ทุก 10 วินาที ───── */
    useEffect(() => {
        if (!lesson) return;
        const timer = setInterval(() => {
            if (progress > 0) {
                axios.put(`http://localhost:8080/progress/${lesson.id}`, {
                    percent: Math.floor(progress),
                });
            }
        }, 10_000);
        return () => clearInterval(timer);
    }, [progress, lesson]);

    if (loading || !lesson)
        return <div className="p-6 text-gray-500">Loading…</div>;

    /* ───── JSX ───── */
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main */}
            <main className="flex-1 p-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* ▶ Left (วีดิโอ + รายละเอียด) */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Video Player */}
                        <div className="w-full rounded-xl overflow-hidden shadow">
                            <video
                                ref={videoRef}
                                controls
                                onTimeUpdate={handleTimeUpdate}
                                poster={lesson.thumbnailUrl}
                                className="w-full h-auto bg-black"
                                src={lesson.videoUrl || fallbackVideo}
                            />
                            {/* progress bar ใต้ video */}
                            <div className="h-1 bg-gray-300">
                                <div
                                    className="h-full bg-blue-600 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* About Section */}
                        <section className="bg-white rounded-xl shadow p-6 space-y-4">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {lesson.title}
                            </h1>
                            <span className="text-xs font-semibold uppercase text-purple-600">
                {lesson.category}
              </span>
                            <p className="text-gray-700 leading-relaxed">
                                {lesson.description}
                            </p>
                            <p className="text-sm text-gray-500">
                                Author: {lesson.authorName || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                                Progress: {Math.floor(progress)}%
                            </p>
                        </section>
                    </div>

                    {/* ▶ Right “Schedule” mock */}
                    <aside className="space-y-6">
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-sm font-semibold mb-4 text-gray-700">
                                Schedule
                            </h3>
                            {[
                                "What is Scrum?",
                                "Scrum Events",
                                "Scrum Artifacts",
                                "Agile Estimation",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-2 mb-4">
                                    <div className="w-2 h-2 mt-1 bg-blue-600 rounded-full" />
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {item}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Tika Sarak S.Pd
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default LessonDetailPage;
