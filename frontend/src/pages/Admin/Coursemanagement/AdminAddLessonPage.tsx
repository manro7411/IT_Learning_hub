import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";

interface LessonFormState {
  title: string;
  description: string;
  category: "AGILE" | "SCRUM" | "WATERFALL";
  thumbnailUrl: string; // used as either image or document base64
  quizAttemptLimit: number;
  assignType: "all" | "team" | "specific";
  assignTeamId?: string;
  dueDate?: string;
  questions: QuestionForm[];
}

interface QuestionForm {
  questionText: string;
  type: "single" | "multiple" | "fill" | "ordering" | "matching";
  options: string[];
  correctAnswers: string[];
}

interface User {
  id: string;
  name: string;
  userPicture?:string;
}

interface Team {
  id: string;
  name: string;
}

const INITIAL_FORM: LessonFormState = {
  title: "",
  description: "",
  category: "AGILE",
  thumbnailUrl: "",
  quizAttemptLimit: 1,
  assignType: "all",
  questions: [],
  dueDate: ""
};

const tabs = [
  { label: "Video_Content", value: "video" },
  { label: "Document_Content", value: "document" },
];

const AdminAddLessonPage = () => {
  const { token, user  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<LessonFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
   const [authorAvatarUrl, setAuthorAvatarUrl] = useState<User | null>(null);

// user should have: id, name, userPicture


  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

 
 useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // console.log("👤 Retrieved user profile:", res.data);
          setAuthorAvatarUrl({
            id: res.data.id,
            name: res.data.name,
            userPicture: `${res.data.avatarUrl}`, 
            });
        })
        .catch((err) => {
          console.error("❌ Failed to fetch user profile", err);
        });
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios.get<User[]>("http://localhost:8080/profile/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => console.error("❌ Failed to load users"));

    axios.get<Team[]>("http://localhost:8080/teams", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeams(res.data))
      .catch(() => console.error("❌ Failed to load teams"));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quizAttemptLimit" ? parseInt(value) : value,
    }));
  };

  const handleAssignTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as LessonFormState["assignType"];
    setForm((prev) => ({
      ...prev,
      assignType: value,
      assignTeamId: value !== "team" ? undefined : prev.assignTeamId,
    }));
    if (value === "specific") setShowUserModal(true);
    else setSelectedUsers([]);
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string | string[]) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setForm({ ...form, questions: updatedQuestions });
  };

  const addQuestion = () => setForm((prev) => ({
    ...prev,
    questions: [...prev.questions, { questionText: "", type: "single", options: [""], correctAnswers: [""] }],
  }));

  const addOption = (qIdx: number) => {
    const updated = [...form.questions];
    updated[qIdx].options.push("");
    setForm({ ...form, questions: updated });
  };

  const addCorrectAnswer = (qIdx: number) => {
    const updated = [...form.questions];
    updated[qIdx].correctAnswers.push("");
    setForm({ ...form, questions: updated });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedUsers([]);
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    

    const payload = {
      contentType: "video",
      title: form.title,
      description: form.description,
      category: form.category,
      thumbnailUrl: form.thumbnailUrl,
      maxAttempts: form.quizAttemptLimit,
      assignType: form.assignType,
      assignedUserIds: form.assignType === "specific" ? selectedUsers : [],
      assignedTeamIds: form.assignType === "team" && form.assignTeamId ? [form.assignTeamId] : [],
      dueDate: form.dueDate || null,
      authorAvatarUrl: authorAvatarUrl?.userPicture ?? "",
      questions: form.questions.map((q) => ({
        questionText: q.questionText,
        type: q.type,
        choices: q.options.map((text) => ({
          text,
          isCorrect: q.correctAnswers.includes(text),
        })),
      })),
    };

    console.log("📤 Submitting payload:", payload);

    try {
      await axios.post("http://localhost:8080/learning", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Video lesson created!");
      resetForm();
      navigate("/admin/lesson/management");
    } catch (err) {
      alert("❌ Failed to create video lesson");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSubmit = async () => {
    setLoading(true);
    const payload = {
      contentType: "document",
      title: form.title,
      description: form.description,
      documentBase64: form.thumbnailUrl,
      avatarUrl: user?.userPicture ?? "",
    };

    try {
      await axios.post("http://localhost:8080/learning/documents", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Document uploaded!");
      resetForm();
      navigate("/admin/lesson/management");
    } catch (err) {
      alert("❌ Failed to upload document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-10 space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-blue-800 pb-2">📚 Add New Lesson</h1>
        <div className="flex space-x-6 border-b mb-6 text-sm font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`pb-2 ${
                activeTab === tab.value
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "video" && (
          <form onSubmit={handleVideoSubmit} className="bg-white p-8 rounded-xl shadow space-y-6">
            <Field label="Lesson Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} />
            <Field label="Lesson Title" name="title" value={form.title} onChange={handleChange} required />
            <Field label="Description" name="description" value={form.description} onChange={handleChange} />
            <Field label="Category" name="category" value={form.category} onChange={handleChange} />
            <div>
              <label className="text-sm font-medium text-gray-700">Assign To</label>
              <select name="assignType" value={form.assignType} onChange={handleAssignTypeChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
                <option value="all">All Users</option>
                <option value="team">Specific Team</option>
                <option value="specific">Specific Users</option>
              </select>
              {form.assignType === "team" && (
                <select
                  name="assignTeamId"
                  value={form.assignTeamId || ""}
                  onChange={(e) => setForm({ ...form, assignTeamId: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                >
                  <option value="">-- Select a team --</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              )}
              {form.assignType === "specific" && selectedUsers.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected users: {users.filter(u => selectedUsers.includes(u.id)).map(u => u.name).join(", ")}
                </p>
              )}
            </div>
            <div className="flex justify-between gap-4">
              <Field label="Max Quiz Attempts" name="quizAttemptLimit" type="number" min={1} max={3} value={form.quizAttemptLimit.toString()} onChange={handleChange} />
              <Field label="Due Date & Time" name="dueDate" type="datetime-local" value={form.dueDate || ""} onChange={handleChange} />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Questions</h2>
              {form.questions.map((q, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <input className="w-full border px-2 py-1 rounded" placeholder="Question text" value={q.questionText} onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)} />
                  <select value={q.type} onChange={(e) => handleQuestionChange(idx, "type", e.target.value as QuestionForm["type"])} className="w-full border px-2 py-1 rounded">
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="fill">Fill in the Blank</option>
                    <option value="ordering">Ordering</option>
                    <option value="matching">Matching</option>
                  </select>
                  <div>
                    <h4 className="text-sm font-medium">Options</h4>
                    {q.options.map((opt, oIdx) => (
                      <input key={oIdx} className="w-full border px-2 py-1 rounded" value={opt} onChange={(e) => {
                        const opts = [...q.options];
                        opts[oIdx] = e.target.value;
                        handleQuestionChange(idx, "options", opts);
                      }} />
                    ))}
                    <button type="button" onClick={() => addOption(idx)} className="text-blue-600 text-sm underline">+ Add Option</button>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Correct Answers</h4>
                    {q.correctAnswers.map((ans, aIdx) => (
                      <input key={aIdx} className="w-full border px-2 py-1 rounded" value={ans} onChange={(e) => {
                        const answers = [...q.correctAnswers];
                        answers[aIdx] = e.target.value;
                        handleQuestionChange(idx, "correctAnswers", answers);
                      }} />
                    ))}
                    <button type="button" onClick={() => addCorrectAnswer(idx)} className="text-green-600 text-sm underline">+ Add Correct Answer</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addQuestion} className="text-blue-700 font-semibold">+ Add Question</button>
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">{loading ? "Saving…" : "Create Lesson"}</button>
              <button type="button" onClick={resetForm} className="text-gray-600 hover:underline">Reset</button>
            </div>
          </form>
        )}

        {activeTab === "document" && (
          <div className="bg-white p-8 rounded-xl shadow space-y-6">
            <h2 className="text-lg font-semibold text-blue-800">📄 Upload Document</h2>
            <Field label="Lesson Title" name="title" value={form.title} onChange={handleChange} required />
            <Field label="Lesson Description" name="description" value={form.description} onChange={handleChange} />
            <div>
              <label className="text-sm font-medium text-gray-700">Upload File (.pdf, .doc, .docx)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setForm((prev) => ({
                        ...prev,
                        thumbnailUrl: reader.result as string,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div className="flex gap-4">
              <button onClick={handleDocumentSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">{loading ? "Uploading…" : "Upload Document"}</button>
              <button onClick={resetForm} className="text-gray-600 hover:underline">Reset</button>
            </div>
          </div>
        )}

        {/* User modal */}
        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-lg font-bold mb-4">Select Users</h2>
              <select multiple value={selectedUsers} onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, o => o.value))} className="w-full h-40 border p-2 rounded-lg bg-gray-50">
                {users.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
              </select>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function Field(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, ...inputProps } = props;
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input {...inputProps} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
    </div>
  );
}

export default AdminAddLessonPage;
