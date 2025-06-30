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

const Systemlogging = () => {
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext); // 👈 ใช้ token จาก AuthContext

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get<ChatLog[]>(
          "http://localhost:8080/chatlog/all",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 แนบ token ใน header
            },
          }
        );
        setLogs(res.data);
      } catch (err) {
        setError("ไม่สามารถโหลดข้อมูล chat log ได้ (401)");
        console.error("❌ Fetch logs failed:", err);
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
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">System Logging</h1>

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
                    <td className="border px-4 py-2">{log.blocked ? "✔️" : "—"}</td>
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
