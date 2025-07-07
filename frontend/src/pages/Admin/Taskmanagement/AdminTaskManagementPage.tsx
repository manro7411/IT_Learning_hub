import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { useNavigate } from "react-router-dom";

interface Lesson {
    id: number;
    title: string;
    thumbnailUrl?: string;
    category: string;
}

interface UserProgress {
    userEmail: string;
    percent: number;
    lessonId: number;
    score: number;
}

const AdminTaskManagementPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [progressList, setProgressList] = useState<UserProgress[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }

        setLoading(true);
        axios
            .get<Lesson[]>("http://localhost:8080/learning?mine=true", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setLessons(res.data))
            .catch((err) => {
                console.error("❌ Failed to load lessons:", err);
                alert("Failed to fetch lessons.");
            })
            .finally(() => setLoading(false));
    }, [token, navigate]);

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setSelectedUser(null);

        axios
            .get<UserProgress[]>("http://localhost:8080/user/progress/all", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const lessonProgress = res.data.filter((p) => p.lessonId === lesson.id);
                const latestByUser = new Map<string, UserProgress>();
                lessonProgress.forEach((entry) => {
                    latestByUser.set(entry.userEmail, entry);
                });
                setProgressList(Array.from(latestByUser.values()));
            })
            .catch((err) => {
                console.error("❌ Failed to fetch progress:", err);
                alert("Failed to load progress data.");
            });
    };

    const handleDeleteLesson = async (id: number) => {
        if (!window.confirm("Delete this lesson? This cannot be undone!")) return;

        try {
            await axios.delete(`http://localhost:8080/learning/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLessons((prev) => prev.filter((l) => l.id !== id));
            if (selectedLesson?.id === id) {
                setSelectedLesson(null);
                setProgressList([]);
                setSelectedUser(null);
            }
            alert("✅ Lesson deleted");
        } catch (err) {
            console.error("❌ Delete failed:", err);
            alert("Failed to delete lesson.");
        }
    };

    if (!token) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebarWidget />

            <main className="flex-1 p-10 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
                    🧙 Task Management
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lesson List */}
                    <section className="col-span-1 space-y-4">
                        {loading ? (
                            <p className="text-gray-500">Loading lessons...</p>
                        ) : (
                            lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className={`relative cursor-pointer p-4 rounded-xl shadow border transition-all
                                    ${selectedLesson?.id === lesson.id
                                        ? "bg-blue-50 border-blue-500"
                                        : "bg-white hover:border-blue-500"
                                    }`}
                                >
                                    <div onClick={() => handleSelectLesson(lesson)}>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {lesson.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">ID: {lesson.id}</p>
                                        <p className="text-xs text-purple-600 font-semibold uppercase">
                                            {lesson.category}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                        title="Delete lesson"
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))
                        )}
                    </section>

                    {/* User Progress List */}
                    <section className="col-span-1 space-y-4">
                        {progressList.length === 0 && selectedLesson && (
                            <p className="text-gray-400">No progress yet…</p>
                        )}
                        {progressList.map((user) => (
                            <div
                                key={`${user.lessonId}-${user.userEmail}`}
                                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{user.userEmail}</p>
                                    <p className="text-sm text-gray-400">
                                        Lesson ID: {user.lessonId}
                                    </p>
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    View
                                </button>
                            </div>
                        ))}
                    </section>

                    <section className="col-span-1 bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">
                            Quick overview of employee progress
                        </h2>

                        {selectedUser ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div>
                                        <p className="font-medium text-gray-800">{selectedUser.userEmail}</p>
                                        <p className="text-sm text-gray-500">Lesson ID: {selectedUser.lessonId}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Progress</p>
                                    <progress
                                        value={selectedUser.percent}
                                        max={100}
                                        className="w-full h-2 mt-1"
                                    />
                                    <p className="text-right text-xs text-gray-500">
                                        {selectedUser.percent}%
                                    </p>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Quiz:{" "}
                                    {selectedUser.score > 0 ? (
                                        <span className="text-green-600 font-semibold">
                                            Finished ({selectedUser.score} pts)
                                        </span>
                                    ) : (
                                        <span className="text-red-500">Not yet</span>
                                    )}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-400">← Select a user to see details</p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};
export default AdminTaskManagementPage;
