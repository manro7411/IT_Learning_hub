import { useContext, useEffect, useState } from "react";
import type { Post, Comment } from "./KnowledgeForumLayout.tsx";
import { AuthContext } from "../../Authentication/AuthContext.tsx";
import {
  FaCommentDots,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaFilePdf,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";

type Props = {
  post: Post;
};

const PostCardWidget = ({ post }: Props) => {
  const { token, user } = useContext(AuthContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments);

  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(post.likedByUser ?? false);
  const [liking, setLiking] = useState(false);

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatarUrl?: string;
  } | null>(null);

  const userEmail = user?.email || user?.upn;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(`/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setUserProfile(data);
      } catch (err) {
        console.error("❌ Failed to fetch user profile:", err);
      }
    };
    fetchUserProfile();
  }, [token]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
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
        avatarUrl: userProfile?.avatarUrl || "",
      };

      const res = await fetch(`/api/forum/posts/${post.id}/comments`, {
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
      const res = await fetch(`/api/posts/${post.id}/${endpoint}`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      const data = await res.json();
      if (typeof data.likes === "number") setLikes(data.likes);
      if (typeof data.likedByUser === "boolean") setLiked(data.likedByUser ?? false);
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
      setLiked(!nextLiked);
      setLikes(likes);
    } finally {
      setLiking(false);
    }
  };

  const linkify = (text: string): string => {
    const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      const safeUrl = url.replace(/"/g, "&quot;");
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${url}</a>`;
    });
  };

   const renderAvatar = () => {
    if (post.avatarUrl) {
      const isFullUrl = post.avatarUrl.startsWith("http") ;
      const filename = post.avatarUrl.split("/").pop();
      const avatarUrl = isFullUrl
        ? `/api/profile/avatars/${filename}`
        : "";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileNameFromBackend: string | undefined = (post as any).document || undefined;
  const documentUrl = fileNameFromBackend
  ? `/api/posts/postDocument/${encodeURIComponent(fileNameFromBackend)}`
  : undefined;

  const docFileName = fileNameFromBackend || "";
  const docExt = docFileName.includes(".") ? docFileName.split(".").pop()!.toLowerCase() : "";
  const isPdf = docExt === "pdf";
  // console.log("DocumentUrl : ",documentUrl)

  return (
    <article className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <header className="flex items-center gap-3 mb-3">
        {renderAvatar()}
        <div>
          <p className="text-sm font-semibold text-gray-800">{post.authorName}</p>
          <p className="text-xs text-gray-500">{post.authorEmail}</p>
          <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </header>

      <h2 className="text-base font-semibold text-gray-800">{post.title}</h2>
      <p
        className="text-sm text-gray-700 mt-1 whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: linkify(post.message) }}
      />

      {post.pictureUrl && (
        <div className="mt-3">
          {(() => {
            const filename = post.pictureUrl.split("/").pop();
            return (
              <img
                src={`/api/posts/picture/${filename}`}
                alt="Post Image"
                className="w-full max-h-96 object-cover rounded-md border"
              />
            );
          })()}
        </div>
      )}
      {documentUrl && (
        <div className="mt-3">
          <div className="relative w-[200px] rounded-xl border bg-white shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div
              className={`absolute top-0 left-0 px-2 py-1 text-[10px] font-semibold text-white rounded-br-lg ${
                isPdf ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              {isPdf ? "PDF" : (docExt || "FILE").toUpperCase()}
            </div>
            <div className="h-24 w-full bg-gray-50 flex items-center justify-center">
              {isPdf ? (
                <FaFilePdf className="text-xl opacity-20" />
              ) : (
                <div className="text-xs text-gray-500">Preview</div>
              )}
            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-t">
              <span
                className={`px-1.5 py-0.5 text-[10px] leading-none rounded-sm font-bold text-white ${
                  isPdf ? "bg-red-600" : "bg-gray-600"
                }`}
              >
                {isPdf ? "PDF" : (docExt || "FILE").toUpperCase()}
              </span>
              <span className="text-sm font-semibold truncate" title={docFileName}>
                {docFileName}
              </span>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-white border hover:bg-gray-50"
                title="เปิดดู"
              >
                <FaExternalLinkAlt /> เปิดดู
              </a>
              <a
                href={documentUrl}
                download={docFileName || true}
                className="pointer-events-auto inline-flex items-center gap-1 text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                title="ดาวน์โหลด"
              >
                <FaDownload /> ดาวน์โหลด
              </a>
            </div>
          </div>
        </div>
      )}

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

      {showComments && (
        <section className="mt-4 space-y-2 border-t pt-4">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-xs">
                {c.avatarUrl ? (
                  <img
                    src={`/api/profile/avatars/${c.avatarUrl.split("/").pop()}`}
                    alt="User avatar"
                    className="w-6 h-6 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {c.authorName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <p className="font-medium">{c.authorName}</p>
                  <p className="text-gray-700 whitespace-pre-line">{c.message}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}

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
