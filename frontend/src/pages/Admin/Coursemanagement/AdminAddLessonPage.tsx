// AdminAddLessonPage.tsx
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
  questions: QuestionForm[];
}

interface QuestionForm {
  questionText: string;
  type: "single" | "multiple" | "fill" | "ordering" | "matching";
  options: string[];
  correctAnswers: string[];
}

const INITIAL_FORM: LessonFormState = {
  title: "",
  description: "",
  category: "AGILE",
  thumbnailUrl: "",
  questions: [
    {
      questionText: "",
      type: "single",
      options: [""],
      correctAnswers: [""]
    }
  ],
};

const AdminAddLessonPage = () => {
  const { t } = useTranslation("adminaddlesson");

  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState<LessonFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string | string[]) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
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

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { questionText: "", type: "single", options: [""], correctAnswers: [""] },
      ],
    }));
  };

  const resetForm = () => setForm(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      authorName: user?.name || "Admin",
      authorEmail: user?.email || user?.upn || "unknown@host",
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
    <div className="min-h-screen bg- flex">
      <AdminSidebarWidget />
      
      <main className="flex-1 p-10 space-y-6 relative">
        {/* language switcher */}
        <div className="absolute top-6 right-10">
          <LanguageSwitcher />
        </div>
        
        <h1 className="text-2xl font-bold text-blue-800">📚 {t('addnewlesson')}</h1>
    

        <form
          onSubmit={handleSubmit}
          className="bg-white pt-4 px-8 pb-8 rounded-xl shadow space-y-4 max-w-3xl"
        >
          <div className= "space-y-3">
            <h2 className="text-2xl font-semibold">{t('lesson')}</h2>
              <div>
                <label className="text-base font-medium text-gray-700">{t('title')}</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
                />
              </div>
          </div>
          

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-medium text-gray-700">{t('category')}</label>
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
              <label className="text-base font-medium text-gray-700">{t('thumbnail')}</label>
              <input
                name="thumbnailUrl"
                value={form.thumbnailUrl}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="text-base font-medium text-gray-700">{t('description')}</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50"
              placeholder={t('briefOverview')}
            />
          </div>

          <div className="space-y-4 ">
            <h2 className="text-2xl font-semibold">{t('question')}</h2>

            {form.questions.map((q, qIdx) => (
              <div key={qIdx} className="border shadow p-4 rounded-xl space-y-2">
                <input
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                  placeholder={t('questiontext')}
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIdx, "questionText", e.target.value)}
                />
                <select
                  value={q.type}
                  onChange={(e) => handleQuestionChange(qIdx, "type", e.target.value as QuestionForm["type"])}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                >
                  <option value="single">{t('single')}</option>
                  <option value="multiple">{t('multiple')}</option>
                  <option value="fill">{t('fill')}</option>
                  <option value="ordering">{t('order')}</option>
                  <option value="matching">{t('match')}</option>
                </select>
                {q.options.map((opt, oIdx) => (
                  <input
                    key={oIdx}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                   
                    placeholder={t('option', { number: oIdx + 1 })}

                    value={opt}
                    onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => handleAddOption(qIdx)}
                  className="text-blue-600 text-sm underline pl-3"
                >
                 {t('addoption')}
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {t('addquestion')}
            </button>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? t('saving') : t('create')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-400 hover:bg-red-500 text-white px-8 py-2 rounded-lg"
            >
              {t('reset')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminAddLessonPage;
