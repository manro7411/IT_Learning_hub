import { useState, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const AddPostWidget = ({ onCreated }: { onCreated?: () => void }) => {
    const { t } = useTranslation("usergroup");
    const { user, token } = useContext(AuthContext);

    const [open, setOpen]       = useState(false);
    const [title, setTitle]     = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim()) {
            setErrorMsg("Please fill in both title and message.");
            return;
        }

        setLoading(true);
        setErrorMsg("");

        try {
            await delay(1000);

            const headers: Record<string, string> = { "Content-Type": "application/json" };
            if (token) headers.Authorization = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers,
                body: JSON.stringify({ title, message , authorName: user?.name  })
            });

            if (res.ok) {
                setOpen(false);
                setTitle("");
                setMessage("");
                onCreated?.();
            } else {
                const err = await res.json().catch(() => ({}));
                setErrorMsg(err.message ?? "Failed to create post");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setErrorMsg("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg hover:bg-blue-700"
                onClick={() => setOpen(true)}
                aria-label="Create new post"
            >
                + {t('newPost')}
            </button>
            {open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">{t('newPost')}</h2>

                        <p className="text-sm mb-2 text-gray-600">
                            {t('author')}: <b>{user?.name ?? "Unknown"}</b>
                        </p>

                        <input
                            className="w-full border rounded px-3 py-2 mb-2"
                            placeholder={t('title')}
                            maxLength={255}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            className="w-full border rounded px-3 py-2 h-28 mb-4"
                            placeholder={t('message')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        {errorMsg && (
                            <div className="text-red-600 text-sm mb-3">{errorMsg}</div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                {t('cancel')}
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        {t('posting')}
                                    </>
                                ) : (
                                    t('post')
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddPostWidget;
