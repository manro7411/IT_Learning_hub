import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Save } from "lucide-react";

export interface Lesson {
  id: number;
  title: string;
  thumbnailUrl?: string;
  category: string;
  description: string;
  contentType: "video" | "document";
  assignType: "all" | "team" | "specific";
}

interface EditLessonModalProps {
  open: boolean;
  initial: Lesson;
  onClose: () => void;
  onSave: (data: {
    title: string;
    category: string;
    description: string;
    thumbnailUrl?: string;
    video?: File | null;
    contentType: "video" | "document";
    assignType: "all" | "team" | "specific";
    
  }) => Promise<void> | void;
}

const EditLessonModal = ({ open, initial, onClose, onSave }: EditLessonModalProps) => {
  const [title, setTitle] = useState(initial.title);
  const [category, setCategory] = useState(initial.category);
  const [description, setDescription] = useState(initial.description);
  const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnailUrl ?? "");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [contentType, setContentType] = useState<"video" | "document">("video");
  const [assignType, setAssignType] = useState<"all" | "specific" | "team">("all");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchLessonDetails = async () => {
      try {
        const response = await fetch(`/api/learning/${initial.id}`);
        const data = await response.json();
        console.log(data)

        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setThumbnailUrl(data.thumbnailUrl ?? "");
        console.log("Content-type: ",data.contentType.toLowerCase())
        setContentType(data.contentType.toLowerCase()); 
        setAssignType(data.assignType);
        setVideoFile(null);
      } catch (error) {
        console.error("Failed to fetch lesson details:", error);
      }
    };

    fetchLessonDetails();
  }, [open, initial.id]);

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        video: videoFile,
        contentType,
        assignType
      });
    } finally {
      setSaving(false);
    }
  };

  const modal = (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6"
        onClick={stop}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-full">
            <h2 className="text-lg font-semibold text-center">Edit Learning Content</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
            <input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://..."
              type="url"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Lesson title"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Category"
              required
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 border rounded-lg px-3 py-2"
              placeholder="Description"
              required
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <div className="px-3 py-2 border rounded-lg bg-gray-100 text-gray-700">
              {contentType === "video" ? "Video" : "Document"}
            </div>
          </div>

          {contentType === "video" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setVideoFile(file);
                }}
                disabled={saving}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}

          {contentType === "document" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setVideoFile(file);
                }}
                disabled={saving}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          )}
           <div className="px-3 py-2 border rounded-lg bg-gray-100 text-gray-700">
              {assignType}
            </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Type</label>
             
            <select
                value={assignType}
                onChange={(e) => setAssignType(e.target.value as "all" | "specific" | "team")}
                className="w-full border rounded-lg px-3 py-2"
                disabled={saving}
            >
                <option value="all">All</option>
                <option value="specific">Specific Users</option>
                <option value="team">Team</option>
            </select>
            </div>


          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              disabled={saving}
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default EditLessonModal;
