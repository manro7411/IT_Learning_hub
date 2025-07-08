import { useContext, useState } from "react";
import type { Post, Comment } from "./KnowledgeForumLayout.tsx";
import { AuthContext } from "../../Authentication/AuthContext.tsx";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

type Props = {
    post: Post;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const PostCardWidget = ({ post }: Props) => {
    const { t } = useTranslation("usergroup");

    const { token, user } = useContext(AuthContext);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>(post.comments);

    const fetchComments = async () => {
        try {
            const res = await fetch(`${API_URL}/forum/posts/${post.id}/comments`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            setComments(data);
        } catch (err) {
            console.error("Failed to load comments:", err);
        }
    };

    const handleCommentSubmit = async () => {
        const trimmed = commentText.trim();
        if (!trimmed) return;

        try {
            const payload = {
                message: trimmed,
                authorName: user?.name || "Anonymous",
                authorEmail: user?.email || user?.upn || "unknown@example.com",
            };

            await fetch(`${API_URL}/forum/posts/${post.id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            setCommentText("");
            await fetchComments(); // 🔁 refresh แบบ real-time
        } catch (err) {
            console.error("Failed to submit comment:", err);
        }
    };

    const handleToggleComments = async () => {
        setShowComments((prev) => !prev);
        if (!showComments) {
            await fetchComments(); // load ถ้ายังไม่ได้โหลด
        }
    };

    return (
        <article className="bg-white rounded-lg shadow p-4">
            {/* Header */}
            <header className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                    <p className="text-lg font-semibold">{post.authorName}</p>
                    <p className="text-xs text-gray-500">{post.authorEmail}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            </header>

            {/* Body */}
            <h2 className="text-base font-semibold text-gray-800">{post.title}</h2>
            <p className="text-lg text-gray-700 mt-1 whitespace-pre-line">{post.message}</p>

            {/* Stats */}
            <div className="flex gap-4 text-sm text-gray-500 mt-3">
                <span>👁 {post.views}</span>
                <button
                    type="button"
                    className="hover:underline"
                    onClick={handleToggleComments}
                >
                    💬 {comments.length}
                </button>
                <span>⬆️ {post.likes}</span>
            </div>

            {/* Comments Section */}
            {showComments && (
                <section className="mt-3 space-y-2 border-t pt-3">
                    {comments.length === 0 ? (
                        <p className="text-xs text-gray-400">{t('nocomment')}</p>
                    ) : (
                        comments.map((c) => (
                            <div key={c.id} className="text-xs">
                                <p className="font-medium text-sm">{c.authorName}</p>
                                <p className="text-gray-600 whitespace-pre-line text-base">{c.message}</p>
                                <p className="text-[10px] text-gray-400">
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}

                    {/* Composer */}
                    <div className="mt-2 flex flex-col gap-2">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
                            rows={3}
                            placeholder={t('addcomment')}
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleCommentSubmit}
                                disabled={!commentText.trim()}
                                className="bg-blue-600 text-white rounded px-3 py-1 text-xs font-medium hover:bg-blue-700 disabled:opacity-40"
                            >
                                {t('submit')}
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
};
export default PostCardWidget;
