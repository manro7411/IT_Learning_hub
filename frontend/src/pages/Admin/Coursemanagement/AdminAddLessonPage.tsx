// AdminAddLessonPage.tsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";

interface LessonFormState {
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  quizAttemptLimit: number;
  assignType: "all" | "team" | "specific";
  assignTeamId?: string;
  dueDate?: string;
  questions: QuestionForm[];
  videoUrl: string;
  documentUrl: string;
}

interface QuestionForm {
  questionText: string;
  type: "single" | "multiple" | "fill" | "ordering" | "matching";
  options: string[];
  correctAnswers: string[];
}

interface User { id: string; name: string; }
interface Team { id: string; name: string; }

const INITIAL_FORM: LessonFormState = {
  title: "",
  description: "",
  category: "",
  thumbnailUrl: "",
  quizAttemptLimit: 1,
  assignType: "all",
  questions: [],
  dueDate: "",
  videoUrl: "",
  documentUrl: "",
};

const tabs = [
  { label: "Video_Content", value: "video" },
  { label: "Document_Content", value: "document" },
];

const AdminAddLessonPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<LessonFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "document">("video");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    axios.get<User[]>("http://localhost:8080/profile/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(() => console.error("Failed to load users"));

    axios.get<Team[]>("http://localhost:8080/teams", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTeams(res.data))
      .catch(() => console.error("Failed to load teams"));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "quizAttemptLimit" ? parseInt(value) : value }));
  };

  const handleAssignTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as LessonFormState["assignType"];
    setForm((prev) => ({ ...prev, assignType: value, assignTeamId: value === "team" ? prev.assignTeamId : undefined }));
    if (value === "specific") setShowUserModal(true);
    else setSelectedUsers([]);
  };

  const handleQuestionChange = (idx: number, field: keyof QuestionForm, value: string | string[]) => {
    const questions = [...form.questions];
    questions[idx] = { ...questions[idx], [field]: value };
    setForm((prev) => ({ ...prev, questions }));
  };

  const addQuestion = () => setForm((prev) => ({
    ...prev,
    questions: [...prev.questions, { questionText: "", type: "single", options: [""], correctAnswers: [""] }],
  }));

  const addOption = (idx: number) => {
    const questions = [...form.questions];
    questions[idx].options.push("");
    setForm((prev) => ({ ...prev, questions }));
  };

  const addCorrectAnswer = (idx: number) => {
    const questions = [...form.questions];
    questions[idx].correctAnswers.push("");
    setForm((prev) => ({ ...prev, questions }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      assignedUserIds: form.assignType === "specific" ? selectedUsers : [],
      assignedTeamIds: form.assignType === "team" && form.assignTeamId ? [form.assignTeamId] : [],
      contentType: activeTab,
    };

    try {
      await axios.post("http://localhost:8080/learning", payload, { headers: { Authorization: `Bearer ${token}` } });
      alert("Lesson created successfully");
      resetForm();
      navigate("/admin/lesson/management");
    } catch (err) {
      console.error(err);
      alert("Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">Add New Lesson</h1>
        <div className="flex gap-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`pb-2 ${activeTab === tab.value ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab.value as "video" | "document")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Lesson Title" name="title" value={form.title} onChange={handleChange} required />
          <Field label="Category" name="category" value={form.category} onChange={handleChange} />
          {activeTab === "video" ? (
            <Field label="Video URL" name="videoUrl" value={form.videoUrl} onChange={handleChange} />
          ) : (
            <Field label="Document URL" name="documentUrl" value={form.documentUrl} onChange={handleChange} />
          )}
          <Field label="Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} />

          <div>
            <label className="text-sm font-medium">Assign To</label>
            <select name="assignType" value={form.assignType} onChange={handleAssignTypeChange} className="w-full border mt-1 p-2 rounded">
              <option value="all">All Users</option>
              <option value="team">Specific Team</option>
              <option value="specific">Specific Users</option>
            </select>
            {form.assignType === "team" && (
              <select name="assignTeamId" value={form.assignTeamId || ""} onChange={handleChange} className="w-full mt-1 p-2 border rounded">
                <option value="">-- Select a Team --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            )}
          </div>

          <Field label="Due Date" name="dueDate" type="datetime-local" value={form.dueDate || ""} onChange={handleChange} />
          <Field label="Max Quiz Attempts" name="quizAttemptLimit" type="number" min={1} max={3} value={form.quizAttemptLimit.toString()} onChange={handleChange} />

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full mt-1 border rounded p-2 bg-gray-50" />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Questions</h2>
            {form.questions.map((q, idx) => (
              <div key={idx} className="border p-4 rounded">
                <input className="w-full mb-2 border p-1 rounded" value={q.questionText} placeholder="Question text" onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)} />
                <select className="w-full mb-2 border p-1 rounded" value={q.type} onChange={(e) => handleQuestionChange(idx, "type", e.target.value)}>
                  <option value="single">Single Choice</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="fill">Fill in the Blank</option>
                  <option value="ordering">Ordering</option>
                  <option value="matching">Matching</option>
                </select>
                {q.options.map((opt, oIdx) => (
                  <input key={oIdx} className="w-full mb-1 border p-1 rounded" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => {
                    const opts = [...q.options];
                    opts[oIdx] = e.target.value;
                    handleQuestionChange(idx, "options", opts);
                  }} />
                ))}
                <button type="button" onClick={() => addOption(idx)} className="text-sm text-blue-600">+ Add Option</button>
                <br />
                {q.correctAnswers.map((ans, aIdx) => (
                  <input key={aIdx} className="w-full mb-1 border p-1 rounded" placeholder={`Answer ${aIdx + 1}`} value={ans} onChange={(e) => {
                    const ansArr = [...q.correctAnswers];
                    ansArr[aIdx] = e.target.value;
                    handleQuestionChange(idx, "correctAnswers", ansArr);
                  }} />
                ))}
                <button type="button" onClick={() => addCorrectAnswer(idx)} className="text-sm text-green-600">+ Add Answer</button>
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="text-blue-700 font-semibold">+ Add Question</button>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">{loading ? "Saving..." : "Create Lesson"}</button>
            <button type="button" onClick={resetForm} className="text-gray-600 hover:underline">Reset</button>
          </div>
        </form>
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
