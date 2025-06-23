import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authentication/AuthContext";
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
const getToken = (ctxToken: string | null | undefined): string | null => {
    return (
        ctxToken ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token")
    );
};
const AdminCreateNotificationPage: React.FC = () => {
    const { token: ctxToken } = useContext(AuthContext);
    const token = getToken(ctxToken);
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>(INITIAL_STATE);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        }
        axios
            .get<User[]>("http://localhost:8080/profile/users", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setUsers(res.data))
            .catch((err) => {
                console.error("❌ Failed to load users:", err);
                alert("Failed to load user list.");
            });
    }, [token, navigate]);
    if (!token) return null;
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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
        if (!token) return;
        if (form.target === "USER" && form.selectedUsers.length === 0) {
            alert("❗ Please select at least one user.");
            return;
        }
        const payload = {
            message: form.message,
            target: form.target,
            userIds: form.target === "USER" ? form.selectedUsers : [],
        };
        try {
            setLoading(true);
            await axios.post("http://localhost:8080/notifications", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Notification sent!");
            navigate("/admin");
            setForm(INITIAL_STATE);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert(`❌ ${err.response?.data || "Failed to send notification."}`);
            } else {
                alert("❌ Unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-2xl mx-auto bg-white shadow p-8 rounded-xl space-y-6">
                <h1 className="text-2xl font-bold text-blue-800">📢 Send Notification</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {form.target === "USER" && (
                        <div>
                            <label className="font-medium text-sm text-gray-700">
                                Select Users
                            </label>
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
                            {users.length === 0 && (
                                <p className="text-xs text-gray-400 mt-1">Loading users...</p>
                            )}
                        </div>
                    )}
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
