import React from "react";

// Define types for question and form
interface Question {
  questionText: string;
  type: "single" | "multiple" | "fill" | "ordering" | "matching";
  options: string[];
  correctAnswers: string[];
}

interface LessonForm {
  thumbnailUrl: string;
  title: string;
  category: string;
  assignType: "all" | "team" | "specific";
  quizAttemptLimit: number;
  description: string;
  questions: Question[];
}

interface User {
  id: string;
  name: string;
}

interface LessonCreateFormProps {
  form: LessonForm;
  users: User[];
  selectedUsers: string[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAssignTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleQuestionChange: (index: number, field: string, value: string | string[]) => void;
  handleAddQuestion: () => void;
  handleAddOption: (qIdx: number) => void;
  handleAddCorrectAnswer: (qIdx: number) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  loading: boolean;
}

function Field(props: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, ...inputProps } = props;
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input {...inputProps} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" />
    </div>
  );
}

const LessonCreateForm: React.FC<LessonCreateFormProps> = ({
  form,
  users,
  selectedUsers,
  handleChange,
  handleAssignTypeChange,
  handleQuestionChange,
  handleAddQuestion,
  handleAddOption,
  handleAddCorrectAnswer,
  handleSubmit,
  resetForm,
  loading
}) => {
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl">
      <Field label="Lesson Thumbnail URL" name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} />
      <Field label="Lesson Title" name="title" value={form.title} onChange={handleChange} required />

      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
          <option value="AGILE">Agile</option>
          <option value="SCRUM">Scrum</option>
          <option value="WATERFALL">Waterfall</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Assign To</label>
        <select name="assignType" value={form.assignType} onChange={handleAssignTypeChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50">
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

      <Field label="Max Quiz Attempts" name="quizAttemptLimit" type="number" value={form.quizAttemptLimit.toString()} onChange={handleChange} />

      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full mt-1 px-4 py-2 border rounded-lg bg-gray-50" placeholder="Write a brief overview of this lesson" />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Questions</h2>
        {form.questions.map((q, idx) => (
          <div key={idx} className="border rounded-lg p-4 space-y-2">
            <input className="w-full border px-2 py-1 rounded" placeholder="Question text" value={q.questionText} onChange={(e) => handleQuestionChange(idx, "questionText", e.target.value)} />
            <select value={q.type} onChange={(e) => handleQuestionChange(idx, "type", e.target.value)} className="w-full border px-2 py-1 rounded">
              <option value="single">Single Choice</option>
              <option value="multiple">Multiple Choice</option>
              <option value="fill">Fill in the Blank</option>
              <option value="ordering">Ordering</option>
              <option value="matching">Matching</option>
            </select>

            <div className="space-y-1">
              {q.options.map((opt, oIdx) => (
                <input key={oIdx} className="w-full border px-2 py-1 rounded" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => {
                  const opts = [...q.options];
                  opts[oIdx] = e.target.value;
                  handleQuestionChange(idx, "options", opts);
                }} />
              ))}
              <button type="button" className="text-blue-600 text-sm underline" onClick={() => handleAddOption(idx)}>
                + Add Option
              </button>
            </div>

            <div className="space-y-1">
              {q.correctAnswers.map((ans, aIdx) => (
                <input key={aIdx} className="w-full border px-2 py-1 rounded" placeholder={`Correct answer ${aIdx + 1}`} value={ans} onChange={(e) => {
                  const answ = [...q.correctAnswers];
                  answ[aIdx] = e.target.value;
                  handleQuestionChange(idx, "correctAnswers", answ);
                }} />
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
  );
};

export default LessonCreateForm;