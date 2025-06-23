import { useCallback, useContext, useEffect, useState } from "react";
import { BellIcon } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext"; // ← ปรับ path ตามโปรเจ็กต์คุณ

/* ─────────────── types ─────────────── */
type Notification = {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
};

/* ─────────── component ─────────── */
const NotificationWidget = () => {
    /* token (context → localStorage fallback) */
    const { token: ctxToken } = useContext(AuthContext);
    const token =
        ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");

    /* local state */
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);

    /* ── fetch helper ── */
    const fetchNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const { data } = await axios.get<Notification[]>(
                "http://localhost:8080/notifications", // ✅ เปลี่ยนเส้นทางให้ตรงกับ backend
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setItems(data);
            setUnread(data.filter((n) => !n.read).length);
        } catch (err) {
            console.error("❌ Failed to fetch notifications:", err);
        }
    }, [token]);

    /* โหลดครั้งแรก */
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const toggle = () => {
        if (!open) fetchNotifications(); // เปิด dropdown → รีเฟรช
        setOpen((p) => !p);
    };

    const markAllRead = async () => {
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnread(0);
        try {
            await axios.put(
                "http://localhost:8080/notifications/read-all", // ← ถ้ามี endpoint นี้ใน backend
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("❌ Failed to mark read:", err);
        }
    };

    /* ─────────── UI ─────────── */
    return (
        <div className="relative">
            <button
                onClick={toggle}
                title="Notifications"
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100"
            >
                <BellIcon className="w-6 h-6" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
            {unread}
          </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white shadow-xl border border-gray-100 rounded-xl overflow-auto z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        {items.length > 0 && unread > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500 text-center">
                            No notifications
                        </p>
                    ) : (
                        items.map((n) => (
                            <div
                                key={n.id}
                                className={`px-4 py-3 text-sm border-b last:border-none ${
                                    n.read ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <p className="text-gray-800">{n.message}</p>
                                <p className="text-[11px] text-gray-400">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationWidget;
