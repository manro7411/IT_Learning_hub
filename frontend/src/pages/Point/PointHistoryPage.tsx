import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PointHistoryItem {
    id: string;
    date: string;
    description: string;
    points: number;
}

const PointHistoryPage = () => {
    const[history] = useState<PointHistoryItem[]>([])
    const[loading] = useState(true)
    const[error] = useState<string | null>(null)

    const navigate = useNavigate();

    return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-indigo-600"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Point History</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow p-6">
          {history.length === 0 ? (
            <div className="text-gray-500">No point history found.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Points</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4 border-b">{item.date}</td>
                    <td className="py-2 px-4 border-b">{item.description}</td>
                    <td className="py-2 px-4 border-b">{item.points > 0 ? `+${item.points}` : item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
export default PointHistoryPage;