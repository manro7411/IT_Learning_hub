import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthContext"; // -- ปรับ path ตามโปรเจ็กต์คุณ

/* ──────────────── types ──────────────── */
type User = { id: string; name: string };

type FormState = {
    message: string;
    target: "ALL" | "USER";
    selectedUsers: string[];
};

const INITIAL_STATE: FormState = {
    message: "",
    target: "ALL",
    selectedUsers: [],
};

/* ─────────── Main Component ─────────── */
const AdminCreateNotificationPage: React.FC = () => {
    /* JWT token จาก context (คุณอาจเก็บ localStorage ก็ได้) */
    const { token } = useContext(AuthContext);

    const [form, setForm]   = useState<FormState>(INITIAL_STATE);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    /* โหลดรายชื่อผู้ใช้ (ต้องมี token ก่อน) */
    useEffect(() => {
        if (!token) return; // ยังไม่มี token → ยังไม่เรียก

        axios
            .get<User[]>("http://localhost:8080/profile/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.error("❌ Failed to load users:", err);
                alert("Failed to load user list.");
            });
    }, [token]);

    /* handler ต่าง ๆ */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value as FormState[keyof FormState],
            ...(name === "target" && value === "ALL" ? { selectedUsers: [] } : {}),
        }));
    };

    const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
        setForm((prev) => ({ ...prev, selectedUsers: selected }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert("No auth token – please log in again.");
            return;
        }

        setLoading(true);
        const payload = {
            message: form.message,
            target: form.target,
            userIds: form.target === "USER" ? form.selectedUsers : [],
        };

        try {
            await axios.post("http://localhost:8080/notifications", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Notification sent!");
            setForm(INITIAL_STATE);
        } catch (err) {
            console.error("❌ Failed to send notification:", err);
            alert("Failed to send notification.");
        } finally {
            setLoading(false);
        }
    };

    /* ─────────────── render ─────────────── */
    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-2xl mx-auto bg-white shadow p-8 rounded-xl space-y-6">
                <h1 className="text-2xl font-bold text-blue-800">📢 Send Notification</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* message */}
                    <div>
                        <label className="font-medium text-sm text-gray-700">Message</label>
                        <textarea
                            name="message"
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
                            placeholder="Type your announcement or message..."
                        />
                    </div>

                    {/* target */}
                    <div>
                        <label className="font-medium text-sm text-gray-700">Send To</label>
                        <select
                            name="target"
                            value={form.target}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
                        >
                            <option value="ALL">All Users</option>
                            <option value="USER">Specific Users</option>
                        </select>
                    </div>

                    {/* user list */}
                    {form.target === "USER" && (
                        <div>
                            <label className="font-medium text-sm text-gray-700">Select Users</label>
                            <select
                                multiple
                                value={form.selectedUsers}
                                onChange={handleUserSelect}
                                className="w-full mt-1 p-2 border rounded-lg bg-gray-50 h-40"
                            >
                                {users.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Hold Ctrl / Cmd to select multiple users
                            </p>
                        </div>
                    )}

                    {/* submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Notification"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminCreateNotificationPage;
