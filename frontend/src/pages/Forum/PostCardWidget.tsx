import { useState } from "react";
import type { Post } from "./KnowledgeForumLayout.tsx";

type Props = {
    post: Post;
};

const PostCardWidget = ({ post }: Props) => {
    const [showComments, setShowComments] = useState<boolean>(false);

    return (
        <article className="bg-white rounded-lg shadow p-4">
            {/* ────────── Header ────────── */}
            <header className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                <div>
                    <p className="text-sm font-semibold">{post.authorName}</p>
                    <p className="text-xs text-gray-500">{post.authorEmail}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            </header>

            {/* ────────── Content ────────── */}
            <h2 className="text-base font-semibold text-gray-800">{post.title}</h2>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                {post.message}
            </p>

            {/* ────────── Stats / Actions ────────── */}
            <div className="flex gap-4 text-xs text-gray-500 mt-3">
                <span>👁 {post.views}</span>
                <button
                    type="button"
                    className="hover:underline"
                    onClick={() => setShowComments((v) => !v)}
                >
                    💬 {post.comments.length}
                </button>
                <span>⬆️ {post.likes}</span>
            </div>

            {/* ────────── Comment list ────────── */}
            {showComments && (
                <section className="mt-3 space-y-2 border-t pt-3">
                    {post.comments.length === 0 ? (
                        <p className="text-xs text-gray-400">No comments yet.</p>
                    ) : (
                        post.comments.map((c) => (
                            <div key={c.id} className="text-xs">
                                <p className="font-medium">{c.authorName}</p>
                                <p className="text-gray-600 whitespace-pre-line">{c.message}</p>
                                <p className="text-[10px] text-gray-400">
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </section>
            )}
        </article>
    );
};

export default PostCardWidget;
