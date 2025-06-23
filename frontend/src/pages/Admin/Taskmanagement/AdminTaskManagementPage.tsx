import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
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
}

const AdminTaskManagementPage = () => {
    const { token } = useContext(AuthContext);

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [progressList, setProgressList] = useState<UserProgress[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);

    useEffect(() => {
        if (!token) return;

        axios
            .get<Lesson[]>("http://localhost:8080/learning?mine=true", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setLessons(res.data))
            .catch(console.error);
    }, [token]);

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setSelectedUser(null);

        axios
            .get<UserProgress[]>("http://localhost:8080/admin/progress", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const all = res.data.filter((p) => p.lessonId === lesson.id);

                const latestByUser = new Map<string, UserProgress>();
                all.forEach((entry) => {
                    latestByUser.set(entry.userEmail, entry);
                });

                setProgressList(Array.from(latestByUser.values()));
            })
            .catch(console.error);
    };

    const handleDeleteLesson = async (id: number) => {
        const ok = window.confirm("Delete this lesson? This cannot be undone!");
        if (!ok) return;

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
            console.error(err);
            alert("❌ Delete failed");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebarWidget />

            <main className="flex-1 p-10 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
                    🧙 Task Management
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="col-span-1 space-y-4">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`relative cursor-pointer p-4 rounded-xl shadow border transition-all
                  ${
                                    selectedLesson?.id === lesson.id
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
                        ))}
                    </section>

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
                                        <p className="font-medium text-gray-800">
                                            {selectedUser.userEmail}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Lesson ID: {selectedUser.lessonId}
                                        </p>
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
                                <p className="text-sm text-gray-500">Quiz: Not yet</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">
                                ← Select a user to see details
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminTaskManagementPage;
