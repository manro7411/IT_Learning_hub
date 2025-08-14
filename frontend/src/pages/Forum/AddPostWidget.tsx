import { useState, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";

const categories = ["พูดคุยทั่วไป","ข่าวสาร IT","IT & งานระบบ"];

const AddPostWidget = ({ onCreated }: { onCreated?: () => void }) => {
  const { user, token } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [forumCategory, setforumCategory] = useState("");

  const [picture, setPicture] = useState<File | null>(null);     // รูปหน้าปก
  const [document, setDocument] = useState<File | null>(null);   // เอกสารของโพสต์ (ไฟล์เดียว)

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      setErrorMsg("Please fill in both title and message.");
      return;
    }
    if (!forumCategory) {
      setErrorMsg("Please select a category");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await delay(300);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      formData.append("authorName", user?.name ?? "Unknown");
      formData.append("forumCategory", forumCategory);

      if (picture) {
        formData.append("picture", picture);
        formData.append("pictureFileName", picture.name);
      }

      if (document) {
        formData.append("document", document);
        formData.append("documentFileName", document.name);
      }

      console.log("FormData payload:");
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`${key}: [File] name=${value.name}, size=${value.size}, type=${value.type}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      });

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // อย่าตั้ง Content-Type เอง ให้เบราว์เซอร์ตั้ง boundary ให้อัตโนมัติ
      });

      if (res.ok) {
        setOpen(false);
        setTitle("");
        setMessage("");
        setforumCategory("");
        setPicture(null);
        setDocument(null);
        onCreated?.();
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMsg(err.message ?? "Failed to create post");
      }
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
        + New Post
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create new post</h2>

            <p className="text-sm mb-2 text-gray-600">
              Author: <b>{user?.name ?? "Unknown"}</b>
            </p>

            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Title"
              maxLength={255}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <select
              className="w-full border rounded px-3 py-2 mb-2"
              value={forumCategory}
              onChange={(e) => setforumCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* รูปหน้าปก (image/*) พร้อม drag & drop style ที่คุณใส่ไว้ */}
            <label className="block text-sm text-gray-700 mb-1">รูปหน้าปก (image/*)</label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPicture(file);
                  }}
                />
              </label>
            </div>
            {picture && (
              <p className="text-xs text-gray-600 mt-1">เลือกไฟล์แล้ว: <b>{picture.name}</b></p>
            )}

            {/* เอกสารของโพสต์ (ไฟล์เดียว) */}
            <label className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white" htmlFor="document">
              เอกสารแนบของโพสต์ (ไฟล์เดียว)
            </label>
            <input
              id="document"
              className="block w-full mb-2 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              type="file"
              // รองรับเอกสารยอดนิยม; เอาออกได้ถ้าต้องการให้เลือกได้ทุกชนิด
              accept={[
                ".pdf",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".txt",".csv",".zip",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "text/plain","text/csv","application/zip"
              ].join(",")}
              onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
            />
            {document && (
              <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
                <span className="truncate">เลือกไฟล์แล้ว: <b>{document.name}</b></span>
                <button
                  type="button"
                  onClick={() => setDocument(null)}
                  className="text-red-600 hover:underline"
                >
                  ลบไฟล์
                </button>
              </div>
            )}

            <textarea
              className="w-full border rounded px-3 py-2 h-28 mb-4"
              placeholder="Message"
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
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Posting…
                  </>
                ) : (
                  "Post"
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
