import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";
import { saveAs } from "file-saver";
import Papa from "papaparse";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

interface ChatLog {
  id: string;
  inputMessage: string;
  responseMessage: string;
  userEmail: string;
  blocked: boolean;
  timestamp: string;
}

interface UserProgress {
  lessonId: string;
  lessonTitle: string;
  percent: number;
  score: number;
  userEmail: string;
  updatedAt: string;
}

interface NotificationLog {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  recipientId: string;
  recipientName: string;
}

const tabs = [
  { label: "Chat_Log", value: "chatlog" },
  { label: "User_Progress", value: "progress" },
  { label: "Notifications_activity", value: "notifications" },
];
const Systemlogging = () => {
  const { t } = useTranslation("adminsystemlog");

  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("chatlog");

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');


  const exportChatLogCSV = () => {
    const csv = Papa.unparse(chatLogs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "chat_log.csv");
  };

  const exportProgressCSV = () => {
    const csv = Papa.unparse(userProgress);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "user_progress.csv");
  };

  const exportNotificationsCSV = () => {
    const csv = Papa.unparse(notifications);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "notifications.csv");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const url =
          activeTab === "chatlog"
            ? "http://localhost:8080/chatlog/all"
            : activeTab === "progress"
            ? "http://localhost:8080/progress/all"
            : "http://localhost:8080/notifications/all";

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (activeTab === "chatlog") {
          setChatLogs(res.data);
        } else if (activeTab === "progress") {
          setUserProgress(res.data);
        } else if (activeTab === "notifications") {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("❌ Fetch logs failed:", err);
        setError(`ไม่สามารถโหลดข้อมูล ${activeTab} ได้`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("คุณยังไม่ได้เข้าสู่ระบบ");
      setLoading(false);
    }
  }, [token, activeTab]);

  const filteredData = (() => {
    const lowerQuery = searchQuery.toLowerCase();
    if (activeTab === "chatlog") {
      return chatLogs.filter((log) =>
        log.userEmail.toLowerCase().includes(lowerQuery)
      );
    }
    if (activeTab === "progress") {
      return userProgress.filter((item) =>
        item.lessonTitle.toLowerCase().includes(lowerQuery)
      );
    }
    if (activeTab === "notifications") {
      return notifications.filter((item) =>
        item.recipientName.toLowerCase().includes(lowerQuery)
      );
    }
    return [];
  })();

  const placeholderText =
  activeTab === "chatlog"
    ? "Search Email..."
    : activeTab === "progress"
    ? "Search Title..."
    : activeTab === "notifications"
    ? "Search User..."
    : "";


  const renderTable = () => {
    if (activeTab === "chatlog") {
      return (
        <table className="min-w-full text-base text-left border-collapse border">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Input</th>
              <th className="border px-4 py-2">Response</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Blocked</th>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="border px-4 py-2">{log.id}</td>
                <td className="border px-4 py-2">{log.inputMessage}</td>
                <td className="border px-4 py-2">{log.responseMessage}</td>
                <td className="border px-4 py-2">{log.userEmail}</td>
                <td className="border px-4 py-2">{log.blocked ? "✔️" : "—"}</td>
                <td className="border px-4 py-2">
                  {new Date(log.timestamp).toLocaleString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === "progress") {
      return (
        <table className="min-w-full text-base text-left border-collapse border">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="border px-4 py-2">Lesson ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Progress</th>
              <th className="border px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="border px-4 py-2">{item.lessonId}</td>
                <td className="border px-4 py-2">{item.lessonTitle}</td>
                <td className="border px-4 py-2">{item.userEmail}</td>
                <td className="border px-4 py-2">{item.percent}%</td>
                <td className="border px-4 py-2">
                  {new Date(item.updatedAt).toLocaleString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === "notifications") {
      return (
        <table className="min-w-full text-base text-left border-collapse border">
          <thead className="bg-gray-100 font-bold">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Read</th>
              <th className="border px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.message}</td>
                <td className="border px-4 py-2">{item.recipientName}</td>
                <td className="border px-4 py-2">{item.read ? "✔️" : "—"}</td>
                <td className="border px-4 py-2">
                  {new Date(item.createdAt).toLocaleString("th-TH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return <p className="text-gray-500">ยังไม่มีข้อมูลสำหรับแท็บนี้</p>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebarWidget />

      
      <main className="flex-1 overflow-y-auto p-6">
        {/* Header + Download Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="absolute top-6 right-10">
                <LanguageSwitcher />
          </div>
          
          {activeTab === "chatlog" && (
            <button
              onClick={exportChatLogCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded mr-40"
            >
              {t('download')} Chat Log CSV
            </button>
          )}
          {activeTab === "progress" && (
            <button
              onClick={exportProgressCSV}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded mr-40"
            >
              {t('download')} Progress CSV
            </button>
          )}
          {activeTab === "notifications" && (
            <button
              onClick={exportNotificationsCSV}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded mr-40"
            >
              {t('download')} Notifications CSV
            </button>
          )}
        </div>

        

        <div className="flex space-x-6 border-b mb-6 text-sm font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-2 ${
                activeTab === tab.value
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder={placeholderText}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full xl:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">{renderTable()}</div>
        )}
      </main>
    </div>
  );
};

export default Systemlogging;

