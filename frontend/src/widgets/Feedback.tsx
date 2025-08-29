import { useEffect, useState } from "react";
import axios from "axios";

interface Feedback {
  id: string;
  lessonId: string;
  userEmail: string;
  adminEmail: string;
  feedback: string;
}

const FeedbackWidget = ({ token, lessonId }: { token: string; lessonId: string | ""}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    if (!token || !lessonId) return;

    axios
      .get<Feedback[]>(`/api/user/feedback`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // Filter feedbacks by lessonId
        const filteredFeedbacks = res.data.filter((fb) => fb.lessonId === lessonId);
        setFeedbacks(filteredFeedbacks);
      })
      .catch((err) => console.error("❌ Failed to fetch feedback:", err));
  }, [token, lessonId]);

  if (feedbacks.length === 0) {
    return <p className="text-gray-500">No feedback available for this lesson.</p>;
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">Feedback</h3>
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="mb-4">
          <p className="text-sm text-gray-800">{feedback.feedback}</p>
          <p className="text-xs text-gray-500">By: {feedback.adminEmail}</p>
        </div>
      ))}
    </div>
  );
};

export default FeedbackWidget;