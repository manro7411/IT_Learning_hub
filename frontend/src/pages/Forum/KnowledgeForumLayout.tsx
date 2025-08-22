import { useState, useEffect, useContext} from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import Sidebar from "../../widgets/SidebarWidget";
import PostCardWidget from "./PostCardWidget.tsx";
import AddPostWidget from "./AddPostWidget.tsx";
import { Navigate } from "react-router-dom";

export type Comment = {
  avatarUrl: string;
  id: string;
  authorName: string;
  message: string;
  createdAt: string;
};

export type Post = {
  likedByUser: boolean;
  id: string;
  authorName: string;
  authorEmail: string;
  title: string;
  message: string;
  avatarUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  likedBy: string[]
  comments: Comment[];
  forumCategory:string;
  pictureUrl:string
  documentUrl:string;
};
const formatAvatarUrl = (rawUrl?: string): string | undefined => {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http")) return rawUrl;

  const parts = rawUrl.split("/");
  const filename = parts[parts.length - 1];
  return `/api/posts/avatars/${filename}`;
};

const KnowledgeForumLayout = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
    const [selectedAssignType, setselectedAssignType] = useState<string>("พูดคุยทั่วไป");


  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
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
      const res = await fetch(`/api/posts`, {
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
      // console.log(enrichedPosts)
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

  
  const groupPosts = posts.reduce((acc,post) =>{
    const category = post.forumCategory || "Uncategorized"
    if (!acc[category]) acc[category] = []; 
    acc[category].push(post);
    return acc
  }, {} as Record<string,Post[]>);

  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400 text-sm">No posts available.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-2">
              {["พูดคุยทั่วไป","ข่าวสาร IT","IT & งานระบบ"].map((type) =>(
                <button key={type} onClick={() => setselectedAssignType(type)} className={`px-3 py-1 rounded-md text-sm ${
                    selectedAssignType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            {Object.entries(groupPosts)
            .filter(([category]) => category === selectedAssignType)
            .map(([category, postsInCategory]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  {category}
                </h2>
                <div className="space-y-4">
                  {postsInCategory.map((post) => (
                    <PostCardWidget key={post.id} post={post} />
                  ))}
                </div>
              </div>
          ))}
          </div>

        )}
      </main>
      <aside className="w-80 p-6 hidden lg:block">
      </aside>
      <AddPostWidget onCreated={handlePostCreated} />
    </div>
  );
};

export default KnowledgeForumLayout;
