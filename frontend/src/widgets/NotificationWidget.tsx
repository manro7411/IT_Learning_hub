// src/widgets/NotificationWidget.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BellIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { http } from "../Authentication/http";

type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  targetName: "ALL" | "TEAM" | "USER";
  link?: string; // e.g. "/lesson/123" หรือ URL ภายนอก
};

const NotificationWidget = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [assignTypeFilter, setAssignTypeFilter] = useState<"ALL" | "TEAM" | "USER">("ALL");

  const unread = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await http.get<Notification[]>("/notifications");
      setItems(data ?? []);
    } catch (err) {
      console.error("❌ fetch notifications:", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  // โหลดรอบแรก
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ปิด dropdown เมื่อคลิกนอกกล่อง
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ฟิลเตอร์ (แก้ ALL ให้คืน true = แสดงทั้งหมด)
  const filteredItems = useMemo(() => {
    if (assignTypeFilter === "ALL") return items;
    return items.filter((n) => n.targetName === assignTypeFilter);
  }, [items, assignTypeFilter]);

  const markAllRead = async () => {
    try {
      // optimistic update
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      await http.put("/notifications/read-all", {});
    } catch (err) {
      console.error("❌ mark all read:", err);
      // ถ้าล้มเหลว ลองรีโหลดรายการกลับมาให้ตรงเซิร์ฟเวอร์
      fetchNotifications();
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete ALL notifications?")) return;
    try {
      setItems([]); // optimistic
      await http.delete("/notifications");
    } catch (err) {
      console.error("❌ clear all:", err);
      fetchNotifications();
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
      await http.put(`/notifications/${id}/read`, {});
    } catch (err) {
      console.error("❌ mark single read:", err);
      fetchNotifications();
    }
  };

  const deleteSingle = async (id: string) => {
    try {
      setItems((prev) => prev.filter((n) => n.id !== id)); // optimistic
      await http.delete(`/notifications/${id}`);
    } catch (err) {
      console.error("❌ delete notification:", err);
      fetchNotifications();
    }
  };

  const handleOpen = async () => {
    if (!open) await fetchNotifications();
    setOpen((prev) => !prev);
  };

  const go = (link?: string) => {
    if (!link) return;
    if (link.startsWith("/")) {
      navigate(link);
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleOpen}
        title="Notifications"
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <BellIcon className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl z-50">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="font-semibold text-gray-700">Notifications</span>
            <div className="flex gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1 text-xs text-red-500 hover:underline"
                >
                  <TrashIcon className="h-3 w-3" />
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* ฟิลเตอร์ */}
          <div className="p-4 text-sm text-gray-500 space-x-2">
            {(["ALL", "TEAM", "USER"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setAssignTypeFilter(type)}
                className={`px-3 py-1 rounded-md text-sm ${
                  assignTypeFilter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* สถานะโหลด/เออร์เรอร์/ว่าง */}
          {loading && <p className="p-4 text-center text-sm text-gray-500">Loading...</p>}
          {!loading && error && (
            <p className="p-4 text-center text-sm text-red-500">{error}</p>
          )}
          {!loading && !error && filteredItems.length === 0 && (
            <p className="p-4 text-center text-sm text-gray-500">No notifications</p>
          )}

          {/* รายการแจ้งเตือน */}
          {!loading && !error && filteredItems.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between border-b px-4 py-3 text-sm last:border-none ${
                n.read ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div
                className="cursor-pointer flex-1"
                onClick={() => {
                  if (!n.read) markSingleRead(n.id);
                  go(n.link);
                }}
              >
                <p className={`${n.read ? "text-gray-800" : "font-semibold text-gray-800"}`}>
                  {n.message}
                </p>
                <p className="text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteSingle(n.id)}
                title="Delete"
                className="ml-2 mt-1 text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationWidget;
