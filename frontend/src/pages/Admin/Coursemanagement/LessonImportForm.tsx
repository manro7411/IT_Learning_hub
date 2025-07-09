const LessonImportForm = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow space-y-6 max-w-3xl">
      <h2 className="text-xl font-semibold">📥 Import Lessons</h2>
      <p className="text-sm text-gray-600">Import lessons from a file or external source.</p>
      <input type="file" className="w-full border p-2 rounded-lg bg-gray-50" />
      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
        Import
      </button>
    </div>
  );
};

export default LessonImportForm;
