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
        axios
            .get("http://localhost:8080/learning?mine=true", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setLessons(res.data))
            .catch(console.error);
    }, [token]);

    const handleSelectLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setSelectedUser(null);
        axios
            .get(`http://localhost:8080/admin/progress`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const filtered = res.data.filter((p: UserProgress) => p.lessonId === lesson.id);
                setProgressList(filtered);
            })
            .catch(console.error);
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
                                onClick={() => handleSelectLesson(lesson)}
                                className={`cursor-pointer p-4 rounded-xl shadow border hover:border-blue-500 transition-all ${selectedLesson?.id === lesson.id ? "bg-blue-50 border-blue-500" : "bg-white"}`}
                            >
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {lesson.title}
                                </h3>
                                <p className="text-sm text-gray-500">ID: {lesson.id}</p>
                                <p className="text-xs text-purple-600 font-semibold uppercase">
                                    {lesson.category}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="col-span-1 space-y-4">
                        {progressList.map((user, i) => (
                            <div
                                key={i}
                                className="p-4 bg-white rounded-xl shadow flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{user.userEmail}</p>
                                    <p className="text-sm text-gray-400">Lesson ID: {user.lessonId}</p>
                                </div>
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow"
                                    onClick={() => setSelectedUser(user)}
                                >
                                    View Progress Details
                                </button>
                            </div>
                        ))}
                    </section>

                    {/* รายละเอียด progress */}
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
                                <div>
                                    <p className="text-sm text-gray-500">Quiz: Not yet</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">← Select a user to see details
                            </p>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminTaskManagementPage;
