import { useEffect, useState } from "react";
import axios from "axios";
import { useUserProfile } from "../pages/Lesson/hooks/useUserProfile";
import defaultUser from '../assets/user.png'

interface Feedback {
  id: string;
  lessonId: string;
  userEmail: string;
  feedback: string;
  authorAvatarUrl: string;
  rating: number;
  createdAt: string;
}

const LessonFeedbackWidget = ({
  token,
  lessonId,
}: {
  token: string;
  lessonId: string;
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { email, avatarUrl } = useUserProfile(token);

  useEffect(() => {
    if (!lessonId || !token) return;

    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/feedback/lesson/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [lessonId, token]);

  const handleSubmitFeedback = async () => {
    if (!newFeedback.trim()) {
      alert("❌ Feedback cannot be empty.");
      return;
    }

    try {
      const payload = {
        userEmail: email,
        feedback: newFeedback,
        authorAvatarUrl: avatarUrl,
        ratingScore: newRating,
        learningContent: { id: lessonId },
      };

      const res = await axios.post(`/api/feedback`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Feedback submitted successfully!");
      setFeedbacks((prev) => [...prev, res.data]); // append new feedback
      setNewFeedback(""); // reset input
      setNewRating(0); // reset rating
    } catch (err) {
      console.error("❌ Failed to submit feedback:", err);
      alert("Failed to submit feedback.");
    }
  };

  const extractFileName = (url: string) => {
      return url && url.trim() ?  url.split("/").pop() : "";
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">Feedback</h3>

      {loading ? (
        <p className="text-gray-500">Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback available for this lesson.</p>
      ) : (
        feedbacks.map((feedback, idx) => (
          <div
            key={feedback.id || idx}
            className="mb-4 flex items-start space-x-4"
          >
            <img
                src={
                feedback.authorAvatarUrl && extractFileName(feedback.authorAvatarUrl)
                  ? `/api/profile/avatars/${extractFileName(feedback.authorAvatarUrl)}`
                  : defaultUser // Use defaultUser if URL is invalid
              }
              alt="Author Avatar"
              className="w-10 h-10 rounded-full object-cover border"
              onError={(e) => (e.currentTarget.src = defaultUser)}
            />
            <div className="flex flex-col">
              <p className="text-sm text-gray-800">{feedback.feedback}</p>
              <p className="text-xs text-gray-500 mt-1">
                By: {feedback.userEmail}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={`${feedback.id || idx}-star-${star}`}
                      className={`w-5 h-5 ${
                        feedback.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {feedback.rating >= star ? "⭐" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({feedback.rating}/5)
                </span>
              </div>
            </div>
          </div>
        ))
      )}

      <textarea
        value={newFeedback}
        onChange={(e) => setNewFeedback(e.target.value)}
        className="h-32 w-full border rounded-lg px-3 py-2 mt-4"
        placeholder="Write your feedback here..."
      />

      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">
          Rate this lesson:
        </label>
        <div className="flex space-x-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={`new-rating-star-${star}`}
              onClick={() => setNewRating(star)}
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl"
            >
              {newRating >= star ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmitFeedback}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default LessonFeedbackWidget;
