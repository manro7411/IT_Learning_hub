import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import Sidebar from "../../widgets/SidebarWidget";
import PostCardWidget from "./PostCardWidget.tsx";
import AddPostWidget from "./AddPostWidget.tsx";
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
  avatarUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: Comment[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

/**
 * Converts stored relative avatar paths (like `uploads/avatars/...`) 
 * into valid accessible URLs via /posts/avatars/{filename}
 */
const formatAvatarUrl = (rawUrl?: string): string | undefined => {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http")) return rawUrl;

  const parts = rawUrl.split("/");
  const filename = parts[parts.length - 1];
  return `${API_URL}/posts/avatars/${filename}`;
};

const KnowledgeForumLayout = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation("usergroup");

  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`${API_URL}/forum/posts/${postId}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.ok ? await res.json() : [];
    } catch (error) {
      console.error("❌ Failed to fetch comments:", error);
      return [];
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/posts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.warn("⚠️ Failed to fetch posts");
        setPosts([]);
        return;
      }

      const basePosts: Omit<Post, "comments">[] = await res.json();

      const enrichedPosts: Post[] = await Promise.all(
        basePosts.map(async (p) => ({
          ...p,
          avatarUrl: formatAvatarUrl(p.avatarUrl),
          comments: await fetchComments(p.id),
        }))
      );

      setPosts(enrichedPosts);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosts();
  }, []);

  const handlePostCreated = () => {
    void fetchPosts();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts available.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCardWidget key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Optional right sidebar */}
      <aside className="w-80 p-6 hidden lg:block">
        {/* Add trending or suggestions here */}
      </aside>

      {/* Add post floating widget */}
      <AddPostWidget onCreated={handlePostCreated} />
    </div>
  );
};

export default KnowledgeForumLayout;
