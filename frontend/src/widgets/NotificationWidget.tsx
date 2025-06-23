import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BellIcon } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
type Notification = {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
};
const NotificationWidget = () => {
    const { token: ctxToken } = useContext(AuthContext);
    const token =
        ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);
    const [error, setError]   = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const load = useCallback(async () => {
        if (!token) return;
        try {
            setError(null);
            const res = await axios.get<Notification[]>(
                "http://localhost:8080/notifications",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setData(res.data);
            setUnread(res.data.filter((n) => !n.read).length);
            console.log("✅ notifications:", res.data);
        } catch (e) {
            console.error("❌ fetch notifications:", e);
            setError("Server error");
        }
    }, [token]);
    useEffect(() => { load(); }, [load]);
    useEffect(() => {
        const handle = (ev: MouseEvent) => {
            if (ref.current && !ref.current.contains(ev.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);
    if (!token) return null;
    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => { if (!open) load(); setOpen((p) => !p); }}
                title="Notifications"
                className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100"
            >
                <BellIcon className="w-6 h-6" />
                {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center
              justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto
                        rounded-xl border border-gray-100 bg-white shadow-xl z-50">
                    <div className="flex items-center justify-between border-b px-4 py-2">
                        <span className="font-semibold text-gray-700">Notifications</span>
                        {unread > 0 && (
                            <button
                                onClick={async () => {
                                    try {
                                        await axios.put(
                                            "http://localhost:8080/notifications/read-all",
                                            {},
                                            { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        setData((p) => p.map((n) => ({ ...n, read: true })));
                                        setUnread(0);
                                    } catch (e) { console.error(e); }
                                }}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    {error && (
                        <p className="p-4 text-center text-sm text-red-500">{error}</p>
                    )}
                    {!error && data.length === 0 && (
                        <p className="p-4 text-center text-sm text-gray-500">
                            No notifications
                        </p>
                    )}
                    {data.map((n) => (
                        <div key={n.id}
                             className={`border-b px-4 py-3 text-sm last:border-none ${
                                 n.read ? "bg-white" : "bg-gray-50"}`}>
                            <p className="text-gray-800">{n.message}</p>
                            <p className="text-[11px] text-gray-400">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default NotificationWidget;
