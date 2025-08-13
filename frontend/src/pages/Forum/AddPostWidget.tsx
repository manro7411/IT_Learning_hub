import { useState, useContext } from "react";
import { AuthContext } from "../../Authentication/AuthContext.tsx";

const categories = ["พูดคุยทั่วไป","ข่าวสาร IT","IT & งานระบบ"];

const AddPostWidget = ({ onCreated }: { onCreated?: () => void }) => {
    const { user, token } = useContext(AuthContext);

    const [open, setOpen]       = useState(false);
    const [title, setTitle]     = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [forumCategory,setforumCategory] = useState("")
    const [picture,setPicture] = useState<File | null>(null)
   


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
        await delay(1000);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("message", message);
        formData.append("authorName", user?.name ?? "Unknown");
        formData.append("forumCategory", forumCategory);
        if (picture) {
            formData.append("picture", picture);
            formData.append("pictureFileName",picture.name)
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
            headers: {Authorization: `Bearer ${token}` },

            body: formData,
        });

        if (res.ok) {
            setOpen(false);
            setTitle("");
            setMessage("");
            setforumCategory("");
            setPicture(null);
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
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    setPicture(file)                
                                }
                            }}
                        />
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
