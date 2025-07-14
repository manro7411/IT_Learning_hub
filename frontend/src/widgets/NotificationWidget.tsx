import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BellIcon, TrashIcon } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";

type Notification = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  targetName: string;
  link?: string;
};

const NotificationWidget = () => {
  const { token: ctxToken } = useContext(AuthContext);
  const token =
    ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [assignTypeFilter, setAssignTypeFilter] = useState<string>("ALL");

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const { data } = await axios.get<Notification[]>(
        "http://localhost:8080/notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems(data);
      console.log("📬 Notifications fetched:", data);
      setUnread(data.filter((n) => !n.read).length);
    } catch (err) {
      console.error("❌ fetch notifications:", err);
      setError("Server error");
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredItems = items.filter((n) => {
    switch (assignTypeFilter) {
      case "ALL":
        return n.targetName === "ALL";
      case "TEAM":
        return n.targetName === "TEAM";
      case "USER":
        return n.targetName === "USER" ;
      default:
        return false;
    }
});


  const markAllRead = async () => {
    try {
      await axios.put(
        "http://localhost:8080/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch (err) {
      console.error("❌ mark all read:", err);
    }
  };

  const clearAll = async () => {
    if (!confirm("Delete ALL notifications?")) return;
    try {
      await axios.delete("http://localhost:8080/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems([]);
      setUnread(0);
    } catch (err) {
      console.error("❌ clear all:", err);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ mark single read:", err);
    }
  };

  const deleteSingle = async (id: string, wasUnread: boolean) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnread((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ delete notification:", err);
    }
  };

  if (!token) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          if (!open) fetchNotifications();
          setOpen((prev) => !prev);
        }}
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

          <div className="p-4 text-sm text-gray-500 space-x-2">
            {["ALL", "TEAM", "USER"].map((type) => (
              <button
                key={type}
                onClick={() => setAssignTypeFilter(type)}
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  assignTypeFilter === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {error && (
            <p className="p-4 text-center text-sm text-red-500">{error}</p>
          )}

          {!error && filteredItems.length === 0 && (
            <p className="p-4 text-center text-sm text-gray-500">
              No notifications
            </p>
          )}

          {filteredItems.map((n) => (
            <div
              key={n.id}
              className={`flex items-start justify-between border-b px-4 py-3 text-sm last:border-none ${
                n.read ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div
                className="cursor-pointer flex-1"
                onClick={() => {
                  markSingleRead(n.id);
                  if (n.link) window.location.href = n.link;
                }}
              >
                <p
                  className={`${
                    n.read ? "text-gray-800" : "font-semibold text-gray-800"
                  }`}
                >
                  {n.message}
                </p>
                <p className="text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => deleteSingle(n.id, !n.read)}
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