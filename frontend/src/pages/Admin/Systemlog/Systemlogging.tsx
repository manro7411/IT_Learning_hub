import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";

interface ChatLog {
  id: string;
  inputMessage: string;
  responseMessage: string;
  userEmail: string;
  blocked: boolean;
  timestamp: string;
}

const tabs = [
  { label: "Chat_log", value: "chatlog" },
  { label: "Table2", value: "table2" },
  { label: "Table3", value: "table3" },
  { label: "Table4", value: "table4" },
];

const Systemlogging = () => {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("chatlog");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get<ChatLog[]>(
          `http://localhost:8080/${activeTab}/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLogs(res.data);
      } catch (err) {
        console.error("❌ Fetch logs failed:", err);
        setError(`ไม่สามารถโหลดข้อมูล ${activeTab} ได้`);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLogs();
    } else {
      setError("คุณยังไม่ได้เข้าสู่ระบบ");
      setLoading(false);
    }
  }, [token, activeTab]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* <div className="w-72 h-full shadow-md bg-white flex-shrink-0">
        <AdminSidebarWidget />
      </div> */}
      <AdminSidebarWidget />

      {/* ✅ Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-4">System Logging</h1>

        {/* ✅ Tab bar */}
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

        {/* ✅ Table content */}
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse border">
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
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="border px-4 py-2">{log.id}</td>
                    <td className="border px-4 py-2">{log.inputMessage}</td>
                    <td className="border px-4 py-2">{log.responseMessage}</td>
                    <td className="border px-4 py-2">{log.userEmail}</td>
                    <td className="border px-4 py-2">
                      {log.blocked ? "✔️" : "—"}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(log.timestamp).toLocaleString("th-TH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Systemlogging;
