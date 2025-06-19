// src/widgets/ChatBubbleWidget.tsx
import { useState } from "react";
import axios from "axios";
import { MessageCircle, X } from "lucide-react";

const ChatBubbleWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        try {
            const res = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "openai/gpt-3.5-turbo",
                    messages: [...messages, userMsg],
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const reply = res.data.choices[0].message;
            setMessages((prev) => [...prev, reply]);
        } catch (err) {
            console.error("❌ Chat error", err);
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
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex space-x-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 px-3 py-2 text-sm border rounded-lg"
                            placeholder="Ask anything..."
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        >
                            Send
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
        </div>
    );
};

export default ChatBubbleWidget;
