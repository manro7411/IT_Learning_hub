import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import Sidebar from "../../widgets/SidebarWidget";
import CalendarWidget from "../../widgets/CalendarWidget";
import PostCardWidget from "./PostCardWidget.tsx";
import AddPostWidget from "./AddPostWidget.tsx";
type Post = {
    id: string;
    authorName: string;
    authorEmail: string;
    title: string;
    message: string;
    createdAt: string;
    views: number;
    likes: number;
};
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const KnowledgeForumLayout = () => {
    const { token } = useContext(AuthContext);

    const [posts, setPosts]   = useState<Post[]>([]);
    const [loading, setLoad]  = useState(true);

    const fetchPosts = async () => {
        try {
            const res  = await fetch(`${API_URL}/posts`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            setPosts(data);
        } finally {
            setLoad(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);
    const handlePostCreated = () => fetchPosts();

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <p className="text-gray-500">Loading posts…</p>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <PostCardWidget
                                key={post.id}
                                user={post.authorName}
                                email={post.authorEmail}
                                time={new Date(post.createdAt).toLocaleString()}
                                title={post.title}
                                message={post.message}
                                views={post.views}
                                comments={0}
                                likes={post.likes}
                            />
                        ))}
                    </div>
                )}
            </main>

            <aside className="w-80 p-6 hidden lg:block">
                <CalendarWidget />
            </aside>
            <AddPostWidget onCreated={handlePostCreated} />
        </div>
    );
};

export default KnowledgeForumLayout;
