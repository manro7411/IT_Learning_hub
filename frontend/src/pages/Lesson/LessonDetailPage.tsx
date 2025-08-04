import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  contentType: "video" | "document";
  thumbnailUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatarUrl?: string;
  quizAttemptLimit?: number;
}

interface Progress {
  lessonId: string;
  percent: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  lastTimestamp: number;
}

const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimestamp = useRef<number>(0);
  const lastSent = useRef<number>(0);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [quizPassed, setQuizPassed] = useState(false);
  const [lastTimestampFromServer, setLastTimestampFromServer] = useState<number | null>(null);
  // const [feedback, setFeedback] = useState<string>("");
  // const [ feedbackSent,setFeedbackSent] = useState(false)
  // const [isPlaying, setIsPlaying] = useState(false);
  const[hasSeeked,setHasSeeked] = useState(false);

  // Fetch lesson
  useEffect(() => {
    axios
      .get<Lesson>(`http://localhost:8080/learning/${id}`)
      .then((res) => setLesson(res.data))
      .catch(() => alert("Lesson not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch user progress
  useEffect(() => {
    if (!lesson || !token) return;

    axios
      .get<Progress[]>(`http://localhost:8080/user/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found = res.data.find((p) => p.lessonId === lesson.id);
        const lastTimestampp = found?.lastTimestamp || 0;
        console.log("Last timestamp from servers:", lastTimestampp);
        console.log("Last time stamp from server : ",found?.lastTimestamp);
        console.log("Progress data fetched:", res.data);
        if (!found) return;

        setAttempts(found.attempts);
        setMaxAttempts(found.maxAttempts);
        setQuizPassed(found.score > 0);
        setHasTakenQuiz(found.attempts >= found.maxAttempts);
        setProgressPercent(found.percent);

        if (typeof found.lastTimestamp === "number" && found.lastTimestamp > 0 ) {
          setLastTimestampFromServer(found.lastTimestamp);
          lastTimestamp.current = found.lastTimestamp;
        }
      })
      .catch(() => console.error("❌ Failed to fetch progress"));
  }, [lesson, token]);

  useEffect(() => {
  const video = videoRef.current;
  console.log("Video metadata loaded:", video?.duration);
  console.log("Last timestamp from server:", lastTimestampFromServer);
  if (
    video &&
    lastTimestampFromServer !== null &&
    lastTimestampFromServer > 0 &&
    video.readyState >= 1 &&
    lastTimestampFromServer < video.duration
  ) {
    video.currentTime = lastTimestampFromServer;
    console.log("Seeked to:", lastTimestampFromServer);
  }
}, [lastTimestampFromServer, lesson]);

  const handleLoadedMetadata = () => {
 const video = videoRef.current;
  if (
    video &&
    lastTimestampFromServer !== null &&
    lastTimestampFromServer > 0 &&
    lastTimestampFromServer < video.duration
  ) {
    video.currentTime = lastTimestampFromServer;
    video.play();
    console.log("⏪ Seeked to:", lastTimestampFromServer);
  }
  setHasSeeked(true);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = video.currentTime;
    if (Math.abs(currentTime - lastTimestamp.current) > 1) {
      lastTimestamp.current = currentTime;
    }

    const percent = (currentTime / video.duration) * 100;
    if (percent > progressPercent) {
      setProgressPercent(percent);
    }
  };

  useEffect(() => {
    if (!lesson || !token || !hasSeeked) return;

    const timer = setInterval(() => {
      const video = videoRef.current;
      const current = Math.floor(progressPercent);
      const currentTime = Math.floor(video?.currentTime || 0);

      if (
        video &&
        progressPercent > 0 &&
        progressPercent < 100 &&
        Math.floor(progressPercent) !== lastSent.current &&
      currentTime > 0 && 
      currentTime >= lastTimestamp.current
      ) {
        lastSent.current = current;
        lastTimestamp.current = currentTime

        axios
          .put(
            `http://localhost:8080/user/progress/${lesson.id}`,
            {
              percent: current,
              lastTimestamp: Math.floor(video.currentTime),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .catch((err) => console.error("❌ PUT failed:", err));
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [lesson, token, progressPercent,hasSeeked]);

  useEffect(() => {
    if (progressPercent >= 100 && !showQuiz) {
      setShowQuiz(true);
    }
  }, [progressPercent, showQuiz]);

  if (loading || !lesson) {
    return <div className="p-6 text-gray-400">⏳ Loading lesson…</div>;
  }

  const filename = lesson.videoUrl?.split("/").pop() || "";

  const renderContent = () => {
    if (lesson?.contentType === "video") {
      
      return (
        <>
        <video
          ref={videoRef}
          controls
          // autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          poster={lesson.thumbnailUrl}
          className="w-full h-auto bg-black"
          src={`http://localhost:8080/learning/video/${filename}`}
        />
        </>
      );
    } else if (lesson.contentType === "document") {
      return (
        <iframe
          src={lesson.documentUrl}
          className="w-full h-[600px] border rounded"
          title="Lesson Document"
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="w-full rounded-xl overflow-hidden shadow">
              {renderContent()}
            </div>

            <section className="bg-white rounded-xl shadow p-6 space-y-4">
              <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
              <span className="text-xs font-semibold uppercase text-purple-600">{lesson.category}</span>
              <p className="text-gray-700">{lesson.description}</p>

              <div className="flex items-center gap-4">
                {lesson.authorAvatarUrl ? (
                  <img
                    src={lesson.authorAvatarUrl}
                    alt="Author Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white">
                    {lesson.authorName?.charAt(0) ?? "?"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">{lesson.authorName || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{lesson.authorEmail || ""}</p>
                </div>
              </div>

              <div className="h-1 bg-gray-300">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-sm text-gray-500">
                Attempts: {attempts}/{maxAttempts || lesson.quizAttemptLimit || 1}
              </p>
            </section>
          </div>

          <aside className="space-y-6 mt-4 xl:mt-0">
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-sm font-semibold mb-4 text-gray-700">Schedule</h3>
              {["What is Scrum?", "Scrum Events", "Scrum Artifacts", "Agile Estimation"].map((item, i) => (
                <div key={i} className="flex items-start space-x-2 mb-4">
                  <div className="w-2 h-2 mt-1 bg-blue-600 rounded-full" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item}</div>
                    <div className="text-xs text-gray-500">Tika Sarak S.Pd</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
            {hasTakenQuiz ? (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-4">❌ Quiz unavailable</h2>
                <p className="text-gray-700 mb-6">
                  {quizPassed
                    ? "You have already passed the quiz."
                    : "You have reached the maximum number of attempts."}
                </p>
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    navigate("/lesson");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Back to Lessons
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">🎉 Lesson Completed!</h2>
                <p className="text-gray-700 mb-2">Take a quiz to test your knowledge.</p>
                <button
                  onClick={() => {
                    setShowQuiz(false);
                    navigate(`/quiz/${lesson.id}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Start Quiz
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {
        progressPercent >= 100 
          ? <div>Feedback section</div>
          : (!hasTakenQuiz && !showQuiz) && (
              <div>
              </div>
            )
      }
    </div>
  );
};

export default LessonDetailPage;
