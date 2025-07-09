import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { AuthContext } from "../../../Authentication/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

interface LessonFormState {
  title: string;
  description: string;
  category: "AGILE" | "SCRUM" | "WATERFALL";
  thumbnailUrl: string;
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

const AdminAddLessonPage = () => {
  const { t } = useTranslation("adminaddlesson");
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState<LessonFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

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

  const handleOptionChange = (qIdx: number, optIdx: number, value: string) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIdx].options[optIdx] = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleAddOption = (qIdx: number) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIdx].options.push("");
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleAddCorrectAnswer = (qIdx: number) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIdx].correctAnswers.push("");
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: "", type: "single", options: [""], correctAnswers: [""] },
      ],
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      thumbnailUrl: form.thumbnailUrl,
      maxAttempts: form.quizAttemptLimit,
      assignType: form.assignType,
      assignedUserIds: form.assignType === "specific" ? selectedUsers : [],
      assignedTeamIds: form.assignType === "team" && form.assignTeamId ? [form.assignTeamId] : [],
      dueDate: form.dueDate || null,
      questions: form.questions.map((q) => ({
        questionText: q.questionText,
        type: q.type,
        choices: q.options.map((text) => ({
          text,
          isCorrect: q.correctAnswers.includes(text),
        })),
      })),
    };

    console.log("📤 Submitting Lesson:", payload);

    try {
      await axios.post("http://localhost:8080/learning", payload, { headers: { Authorization: `Bearer ${token}` } });
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
    <div className="min-h-screen flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-10 space-y-6 relative">
        <div className="absolute top-6 right-10">
          <LanguageSwitcher />
        </div>

        <h1 className="text-2xl font-bold text-blue-800">📚 {t('addnewlesson')}</h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-4 max-w-3xl">
          <div>
            <label className="text-base font-medium text-gray-700">{t('title')}</label>
            <input name="title" value={form.title} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-medium text-gray-700">{t('category')}</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
                <option value="AGILE">Agile</option>
                <option value="SCRUM">Scrum</option>
                <option value="WATERFALL">Waterfall</option>
              </select>
            </div>

            <div>
              <label className="text-base font-medium text-gray-700">{t('thumbnail')}</label>
              <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} required className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
            </div>
          </div>

          <div>
            <label className="text-base font-medium text-gray-700">{t('description')}</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" placeholder={t('briefOverview')} />
          </div>

          <div>
            <label className="text-base font-medium text-gray-700">{t('assignto')}</label>
            <select name="assignType" value={form.assignType} onChange={handleAssignTypeChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
              <option value="all">{t('allusers')}</option>
              <option value="team">{t('specificteam')}</option>
              <option value="specific">{t('specificusers')}</option>
            </select>

            {form.assignType === "team" && (
              <select name="assignTeamId" value={form.assignTeamId || ""} onChange={(e) => setForm({ ...form, assignTeamId: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
                <option value="">{t('selectteam')}</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            )}

            {form.assignType === "specific" && selectedUsers.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {t('selectedusers')}: {users.filter(u => selectedUsers.includes(u.id)).map(u => u.name).join(", ")}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-medium text-gray-700">{t('quizattemptlimit')}</label>
              <input type="number" name="quizAttemptLimit" min={1} max={3} value={form.quizAttemptLimit.toString()} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="text-base font-medium text-gray-700">{t('duedate')}</label>
              <input type="datetime-local" name="dueDate" value={form.dueDate || ""} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{t('question')}</h2>
            {form.questions.map((q, qIdx) => (
              <div key={qIdx} className="border shadow p-4 rounded-xl space-y-2">
                <input className="w-full px-4 py-2 border rounded-lg bg-gray-50" placeholder={t('questiontext')} value={q.questionText} onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)} />
                <select value={q.type} onChange={(e) => handleQuestionChange(qIdx, "type", e.target.value as QuestionForm["type"])} className="w-full px-4 py-2 border rounded-lg bg-gray-50">
                  <option value="single">{t('single')}</option>
                  <option value="multiple">{t('multiple')}</option>
                  <option value="fill">{t('fill')}</option>
                  <option value="ordering">{t('order')}</option>
                  <option value="matching">{t('match')}</option>
                </select>
                {q.options.map((opt, oIdx) => (
                  <input key={oIdx} className="w-full px-4 py-2 border rounded-lg bg-gray-50" placeholder={t('option', { number: oIdx + 1 })} value={opt} onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)} />
                ))}
                <button type="button" onClick={() => handleAddOption(qIdx)} className="text-blue-600 text-sm underline">{t('addoption')}</button>
                <button type="button" onClick={() => handleAddCorrectAnswer(qIdx)} className="text-green-600 text-sm underline ml-4">{t('addcorrectanswer')}</button>
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">{t('addquestion')}</button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg disabled:opacity-50">{loading ? t('saving') : t('create')}</button>
            <button type="button" onClick={resetForm} className="bg-red-400 hover:bg-red-500 text-white px-8 py-2 rounded-lg">{t('reset')}</button>
          </div>
        </form>

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

export default AdminAddLessonPage;
