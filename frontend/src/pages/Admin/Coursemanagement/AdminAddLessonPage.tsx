// src/pages/Admin/Lesson/AdminAddLessonPage.tsx
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";

const AdminAddLessonPage = () => {
    const { token, user } = useContext(AuthContext);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "AGILE",
        thumbnailUrl: "",
        avatarUrl: "",          // ✅ optional avatar
        progressPercent: 0,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () =>
        setForm({
            title: "",
            description: "",
            category: "AGILE",
            thumbnailUrl: "",
            avatarUrl: "",
            progressPercent: 0,
        });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:8080/learning",
                {
                    ...form,
                    authorName: user?.name || "Admin", // ✅ ส่งชื่อ admin
                    authorRole: "Admin",               // ✅ ตำแหน่ง
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("✅ Lesson created!");
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Failed to create lesson.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebarWidget />

            <main className="flex-1 p-10 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
                    📚 Add New Lesson
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl"
                >
                    {/* Thumbnail */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Thumbnail URL
                        </label>
                        <input
                            type="text"
                            name="thumbnailUrl"
                            value={form.thumbnailUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/banner.png"
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Avatar (optional) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Author Avatar URL (optional)
                        </label>
                        <input
                            type="text"
                            name="avatarUrl"
                            value={form.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/avatar.png"
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Lesson Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                        >
                            <option value="AGILE">Agile</option>
                            <option value="SCRUM">Scrum</option>
                            <option value="WATERFALL">Waterfall</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                            placeholder="Write a brief overview of this lesson"
                        />
                    </div>

                    {/* Initial Progress */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Initial Progress %
                        </label>
                        <input
                            type="number"
                            name="progressPercent"
                            value={form.progressPercent}
                            onChange={handleChange}
                            min={0}
                            max={100}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            {loading ? "Saving…" : "Update Content"}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-gray-600 hover:underline"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AdminAddLessonPage;
