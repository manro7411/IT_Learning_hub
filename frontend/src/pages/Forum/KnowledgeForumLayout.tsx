import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import Sidebar from "../../widgets/SidebarWidget";
// import CalendarWidget from "../../widgets/CalendarWidget";
import PostCardWidget from "./PostCardWidget.tsx";
import AddPostWidget from "./AddPostWidget.tsx";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export type Comment = {
    id: string;
    authorName: string;
    message: string;
    createdAt: string;
};

export type Post = {
    id: string;
    authorName: string;
    authorEmail: string;
    title: string;
    message: string;
    createdAt: string;
    views: number;
    likes: number;
    comments: Comment[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const KnowledgeForumLayout = () => {
    const { t } = useTranslation("usergroup");

    const { token } = useContext(AuthContext);
    const [posts, setPosts]   = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchComments = async (postId: string): Promise<Comment[]> => {
        try {
            const res = await fetch(`${API_URL}/forum/posts/${postId}/comments`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            return res.ok ? (await res.json()) as Comment[] : [];
        } catch {
            return [];
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/posts`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });

            const basePosts: Omit<Post, "comments">[] = (await res.json()) as Omit<
                Post,
                "comments"
            >[];

            const enriched: Post[] = await Promise.all(
                basePosts.map(async (p) => ({
                    ...p,
                    comments: await fetchComments(p.id),
                }))
            );

            setPosts(enriched);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchPosts(); // ignore returned promise

    }, []);
    const handlePostCreated = () => {
        void fetchPosts();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <p className="text-gray-500">Loading posts…</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <PostCardWidget key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </main>
            <aside className="w-80 p-6 hidden lg:block relative">
                <div className="absolute top-6 right-6 z-10">
                    <LanguageSwitcher />
                </div>
                
                <div className="pt-16" />
                    {/* <CalendarWidget /> */}
            </aside>

            <AddPostWidget onCreated={handlePostCreated} />
        </div>
    );
};

export default KnowledgeForumLayout;
