import { useContext, useState } from "react";
import type { Post, Comment } from "./KnowledgeForumLayout.tsx";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import {
  FaEye,
  FaCommentDots,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";

type Props = {
  post: Post;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const PostCardWidget = ({ post }: Props) => {
  const { token, user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);

  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  const userEmail = user?.email || user?.upn;

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/forum/posts/${post.id}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("❌ Failed to load comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    try {
      const payload = {
        message: trimmed,
        authorName: user?.name || "Anonymous",
        authorEmail: userEmail || "unknown@example.com",
      };

      const res = await fetch(`${API_URL}/forum/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      setCommentText("");
      await fetchComments();
    } catch (err) {
      console.error("❌ Failed to submit comment:", err);
    }
  };

  const handleToggleComments = async () => {
    const willShow = !showComments;
    setShowComments(willShow);
    if (willShow && comments.length === 0) {
      await fetchComments();
    }
  };
  

  const handleToggleLike = async () => {
    if (!userEmail || liking) return;

    setLiking(true);
    const endpoint = liked ? "unlike" : "like";
    const nextLiked = !liked;
    const optimisticLikes = liked ? likes - 1 : likes + 1;

    setLiked(nextLiked);
    setLikes(optimisticLikes);

    try {
      const res = await fetch(`${API_URL}/posts/${post.id}/${endpoint}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      if (typeof data.likes === "number") setLikes(data.likes);
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
      setLiked(!nextLiked);
      setLikes(likes);
    } finally {
      setLiking(false);
    }
  };

  const renderAvatar = () => {
    if (post.avatarUrl) {
      const isFullUrl = post.avatarUrl.startsWith("http");
      const filename = post.avatarUrl.split("/").pop();
      const avatarUrl = isFullUrl
        ? `${API_URL}/profile/avatars/${filename}`
        : "";

        console.log(avatarUrl)

      return (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
        {post.authorName?.charAt(0)?.toUpperCase() || "?"}
      </div>
    );
  };

  return (
    <article className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-3">
        {renderAvatar()}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {post.authorName}
          </p>
          <p className="text-xs text-gray-500">{post.authorEmail}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </header>

      {/* Title & Message */}
      <h2 className="text-base font-semibold text-gray-800">{post.title}</h2>
      <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
        {post.message}
      </p>

      {/* Stats Section */}
      <div className="flex gap-4 text-xs text-gray-500 mt-3 items-center">
        <span className="flex items-center gap-1">
          <FaEye /> {post.views}
        </span>

        <button
          type="button"
          onClick={handleToggleComments}
          className="hover:underline flex items-center gap-1"
        >
          <FaCommentDots /> {comments.length}
        </button>

        <button
          type="button"
          onClick={handleToggleLike}
          disabled={liking}
          className={`hover:underline flex items-center gap-1 ${
            liked ? "text-red-600 font-bold" : ""
          }`}
        >
          {liked ? <FaHeart /> : <FaRegHeart />} {likes}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <section className="mt-4 space-y-2 border-t pt-4">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="text-xs space-y-1">
                <p className="font-medium">{c.authorName}</p>
                <p className="text-gray-700 whitespace-pre-line">{c.message}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}

          {/* Comment input */}
          <div className="mt-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-xs focus:outline-none focus:ring focus:ring-blue-200"
              rows={3}
              placeholder="Add a comment..."
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleCommentSubmit}
                disabled={!commentText.trim()}
                className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-medium hover:bg-blue-700 disabled:opacity-40"
              >
                Submit
              </button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default PostCardWidget;
