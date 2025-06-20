import { useContext, useState } from "react";
import axios                     from "axios";
import { AuthContext }           from "../../../Authentication/AuthContext";
import AdminSidebarWidget        from "../Widgets/AdminSideBar";
import {useNavigate} from "react-router-dom";

/* ──────────────────────
 *  Internal types
 * ──────────────────────*/
type LessonFormState = {
    title:            string;
    description:      string;
    category:         "AGILE" | "SCRUM" | "WATERFALL";
    thumbnailUrl:     string;
    authorAvatarUrl:  string;      // ← ตรง field กับ backend
    progressPercent:  number;
};
const INITIAL_FORM: LessonFormState = {
    title: "",
    description: "",
    category: "AGILE",
    thumbnailUrl: "",
    authorAvatarUrl: "",
    progressPercent: 0,
};
const AdminAddLessonPage = () => {
    const { token, user } = useContext(AuthContext);    // user = decoded JWT
    const [form, setForm]   = useState<LessonFormState>(INITIAL_FORM);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const resetForm = () => setForm(INITIAL_FORM);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                authorName:      user?.name  || "Admin",
                authorRole:      "Admin",
                authorEmail:     user?.email || user?.upn || "unknown@host",
            };

            await axios.post("http://localhost:8080/learning", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Lesson created!");
            resetForm();
            navigate("/admin/lesson/management");
        } catch (err) {
            console.error(err);
            alert("❌ Failed to create lesson");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebarWidget />

            {/* Main */}
            <main className="flex-1 p-10 space-y-6">
                <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
                    📚 Add New Lesson
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl"
                >
                    <Field
                        label="Lesson URL"
                        name="thumbnailUrl"
                        placeholder="https://example.com/banner.png"
                        value={form.thumbnailUrl}
                        onChange={handleChange}
                    />
                    <Field
                        label="Lesson Title"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                    />

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
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                            placeholder="Write a brief overview of this lesson"
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? "Saving…" : "Create Lesson"}
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

function Field(
    props: {
        label: string;
    } & React.InputHTMLAttributes<HTMLInputElement>
) {
    const { label, ...inputProps } = props;
    return (
        <div>
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input
                {...inputProps}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
            />
        </div>
    );
}

export default AdminAddLessonPage;
