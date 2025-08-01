import { useContext, useState, useRef } from "react";
import axios, { AxiosError } from "axios";
import { MessageCircle, X } from "lucide-react";
import { AuthContext } from "../Authentication/AuthContext";

interface ChatMessage {
  role: string;
  content: string;
}

interface BackendResponse {
  content?: string;
  message?: string;
}

const ChatBubbleWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInappropriateModal, setShowInappropriateModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { token } = useContext(AuthContext);

  const logToBackend = async (
    userMsg: string,
    aiReply: string,
    blocked: boolean
  ) => {
    if (!token) return;

    try {
      await axios.post(
        "/api/chatlog",
        {
          inputMessage: userMsg,
          responseMessage: aiReply,
          blocked,
          timestamp: new Date().toISOString(), // ส่ง timestamp ด้วย
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.warn("❗️ไม่สามารถบันทึก log ได้:", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;
    const userMsg: ChatMessage = { role: "user", content: userInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post<BackendResponse>(
        "/api/filtering",
        { msg: userInput }
      );

      if (res.data.message?.includes("ไม่เหมาะสม")) {
        setShowInappropriateModal(true);
        await logToBackend(userInput, "ข้อความไม่เหมาะสม", true);
        return;
      }

      if (res.data.content) {
        const reply: ChatMessage = {
          role: "assistant",
          content: res.data.content,
        };
        setMessages((prev) => [...prev, reply]);
        await logToBackend(userInput, reply.content, false);
      } else {
        alert("❌ ไม่พบข้อความจาก AI");
      }
    } catch (err) {
      const axiosError = err as AxiosError<BackendResponse>;
      console.error("❌ Backend error", err);
      alert(
        axiosError.response?.data?.message || "❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h2 className="text-sm font-bold">AI Assistant</h2>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm">กำลังโหลด...</div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex space-x-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-3 py-2 text-sm border rounded-lg"
              placeholder="พิมพ์ข้อความ..."
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              ส่ง
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Inappropriate Modal */}
      {showInappropriateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">🚫 คำเตือน</h2>
            <p className="mb-4 text-gray-700">
              ข้อความของคุณไม่เหมาะสม และไม่สามารถส่งได้
            </p>
            <button
              onClick={() => {
                setShowInappropriateModal(false);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubbleWidget;
