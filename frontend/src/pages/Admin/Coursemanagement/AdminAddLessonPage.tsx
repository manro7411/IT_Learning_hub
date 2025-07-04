// prepare to split the code into a separate file
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";

interface LessonFormState {
  title: string;
  description: string;
  category: "AGILE" | "SCRUM" | "WATERFALL";
  thumbnailUrl: string;
  quizAttemptLimit: number;
  assignType: "all" | "team" | "specific";
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
}

const INITIAL_FORM: LessonFormState = {
  title: "",
  description: "",
  category: "AGILE",
  thumbnailUrl: "",
  quizAttemptLimit: 1,
  assignType: "all",
  questions: [],
};

const AdminAddLessonPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<LessonFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(true); // Toggle state

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    axios
      .get<User[]>("http://localhost:8080/profile/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => console.error("❌ Failed to load users"));
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
    setForm((prev) => ({ ...prev, assignType: value }));
    if (value === "specific") setShowUserModal(true);
    else setSelectedUsers([]);
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string | string[]) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, { questionText: "", type: "single", options: [""], correctAnswers: [""] }],
    }));
  };

  const handleAddOption = (qIdx: number) => {
    const updated = [...form.questions];
    updated[qIdx].options.push("");
    setForm({ ...form, questions: updated });
  };

  const handleAddCorrectAnswer = (qIdx: number) => {
    const updated = [...form.questions];
    updated[qIdx].correctAnswers.push("");
    setForm({ ...form, questions: updated });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title.trim() || !form.description.trim()) {
      alert("❗ Please fill in the title and description");
      setLoading(false);
      return;
    }

    if (form.assignType === "specific" && selectedUsers.length === 0) {
      alert("❗ Please select at least one user for 'Specific Users'");
      setLoading(false);
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      thumbnailUrl: form.thumbnailUrl,
      maxAttempts: form.quizAttemptLimit,
      assignType: form.assignType,
      assignedUserIds: form.assignType === "specific" ? selectedUsers : [],
      questions: form.questions.map((q) => ({
        questionText: q.questionText,
        type: q.type,
        choices: q.options.map((text) => ({
          text,
          isCorrect: q.correctAnswers.includes(text),
        })),
      })),
    };

    try {
      await axios.post("http://localhost:8080/learning", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Lesson created!");
      resetForm();
      navigate("/admin/lesson/management");
    } catch (err) {
      alert("❌ Failed to create lesson");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-10 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-800 border-b pb-2">
            {isCreateMode ? "📚 Add New Lesson" : "📥 Import Lessons"}
          </h1>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isCreateMode}
              onChange={() => setIsCreateMode(!isCreateMode)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {isCreateMode ? (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl">
            <Field label="Lesson Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} />
            <Field label="Lesson Title" name="title" value={form.title} onChange={handleChange} required />

            <div>
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
              >
                <option value="AGILE">Agile</option>
                <option value="SCRUM">Scrum</option>
                <option value="WATERFALL">Waterfall</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Assign To</label>
              <select
                name="assignType"
                value={form.assignType}
                onChange={handleAssignTypeChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
              >
                <option value="all">All Users</option>
                <option value="team">Specific Team</option>
                <option value="specific">Specific Users</option>
              </select>
              {form.assignType === "specific" && selectedUsers.length > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected users: {users.filter(u => selectedUsers.includes(u.id)).map(u => u.name).join(", ")}
                </p>
              )}
            </div>

            <Field
              label="Max Quiz Attempts"
              name="quizAttemptLimit"
              type="number"
              min={1}
              max={3}
              value={form.quizAttemptLimit.toString()}
              onChange={handleChange}
            />

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                placeholder="Write a brief overview of this lesson"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Questions</h2>
              {form.questions.map((q, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <input
                    className="w-full border px-2 py-1 rounded"
                    placeholder="Question text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)}
                  />

                  <select
                    value={q.type}
                    onChange={(e) => handleQuestionChange(idx, "type", e.target.value as QuestionForm["type"])}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="single">Single Choice</option>
                    <option value="multiple">Multiple Choice</option>
                    <option value="fill">Fill in the Blank</option>
                    <option value="ordering">Ordering</option>
                    <option value="matching">Matching</option>
                  </select>

                  <div className="space-y-1">
                    {q.options.map((opt, oIdx) => (
                      <input
                        key={oIdx}
                        className="w-full border px-2 py-1 rounded"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oIdx] = e.target.value;
                          handleQuestionChange(idx, "options", opts);
                        }}
                      />
                    ))}
                    <button type="button" className="text-blue-600 text-sm underline" onClick={() => handleAddOption(idx)}>
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-1">
                    {q.correctAnswers.map((ans, aIdx) => (
                      <input
                        key={aIdx}
                        className="w-full border px-2 py-1 rounded"
                        placeholder={`Correct answer ${aIdx + 1}`}
                        value={ans}
                        onChange={(e) => {
                          const answ = [...q.correctAnswers];
                          answ[aIdx] = e.target.value;
                          handleQuestionChange(idx, "correctAnswers", answ);
                        }}
                      />
                    ))}
                    <button type="button" className="text-green-600 text-sm underline" onClick={() => handleAddCorrectAnswer(idx)}>
                      + Add Correct Answer
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="text-blue-700 font-semibold" onClick={handleAddQuestion}>
                + Add Question
              </button>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
                {loading ? "Saving…" : "Create Lesson"}
              </button>
              <button type="button" onClick={resetForm} className="text-gray-600 hover:underline">
                Reset
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">📥 Import Lessons</h2>
            <p className="text-sm text-gray-600">Import lessons from a file or external source.</p>
            <input type="file" className="w-full border p-2 rounded-lg bg-gray-50" />
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
              Import
            </button>
          </div>
        )}

        {showUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
              <h2 className="text-lg font-bold mb-4">Select Users</h2>
              <select
                multiple
                value={selectedUsers}
                onChange={(e) => {
                  const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
                  setSelectedUsers(selected);
                }}
                className="w-full h-40 border p-2 rounded-lg bg-gray-50"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
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
