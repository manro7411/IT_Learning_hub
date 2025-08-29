import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import Sidebar from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import LessonFeedbackWidget from "../../widgets/LearningFeedbackFormWidget";
import "./lesson.css";
import FeedbackWidget from "../../widgets/Feedback";
// Set pdfjs workerSrc for react-pdf

// Set the workerSrc for pdfjs (react-pdf requirement)
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';
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
  quizAvailable?: boolean;
}

interface Progress {
  lessonId: string;
  percent: number;
  score: number;
  attempts: number;
  maxAttempts: number;
  lastTimestamp: number;
  thumbnailUrl: string;
  screenTime: number
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
  const [docprogress,setDocProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [quizPassed, setQuizPassed] = useState(false);
  const [lastTimestampFromServer, setLastTimestampFromServer] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [numPages, setNumPages] = useState(0);

  const [documentScreenTime,setDocumentScreenTime] = useState(0)
  const [videoScreenTime,setVideoScreenTime] = useState(0)

  const [, setTimeSpentOnCurrentPage] = useState(0);
  const [canSwitchPage, setCanSwitchPage] = useState(false);

  useEffect(() => {
    axios
      .get<Lesson>(`/api/learning/${id}`)
      .then((res) => setLesson(res.data))
      .catch(() => alert("Lesson not found"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!lesson || !token) return;

    axios
      .get<Progress[]>(`/api/user/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const found = res.data.find((p) => p.lessonId === lesson.id);
        if (!found) {
          setLastTimestampFromServer(0);
          setDocProgress(0); // Set progress to 0 if no progress is found
          setDocumentScreenTime(0); 
          return;
        }

        // console.log(found.percent)
        // console.log(found.screenTime || 0)
        // console.log("found:", found)

        setAttempts(found.attempts);
        setMaxAttempts(found.maxAttempts);
        setQuizPassed(found.score > 0);
        setHasTakenQuiz(found.attempts >= found.maxAttempts);
        setProgressPercent(found.percent);
        setDocProgress(found.percent); // Set document progress
        setDocumentScreenTime(found.screenTime || 0); // Set document screen time
        setDocumentScreenTime(found.screenTime || 0)


        if (
          typeof found.lastTimestamp === "number" &&
          found.lastTimestamp > 0
        ) {
          setLastTimestampFromServer(found.lastTimestamp);
          lastTimestamp.current = found.lastTimestamp;
        } else {
          setLastTimestampFromServer(0);
        }
      })
      .catch(() => console.error("❌ Failed to fetch progress"));
  }, [lesson, token]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (
      video &&
      lastTimestampFromServer !== null &&
      lastTimestampFromServer > 0 &&
      lastTimestampFromServer < video.duration
    ) {
      video.currentTime = lastTimestampFromServer;
      setTimeout(() => {
        video.currentTime = lastTimestampFromServer;
      }, 300);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const currentTime = video.currentTime;

    if (currentTime > lastTimestamp.current+2) {
      alert("⛔ Skipping is not allowed! 😄")
      video.currentTime = lastTimestamp.current; 
      return;
    }

    if (Math.abs(currentTime - lastTimestamp.current) > 1) {
      lastTimestamp.current = currentTime;
    }

    const percent = (currentTime / video.duration) * 100;
    const newTime = Math.floor(percent);
    // console.log("New Time Updated",newTime)
    if (newTime > progressPercent) {
      setProgressPercent(newTime);
    }
  
    setVideoScreenTime((prev) => {
      const newTime = prev + 1;
      // console.log(`🎥 Video screen time: ${newTime} seconds`);
      return newTime;
    });

  };

  useEffect(() => {
  if (!lesson || !token) return;

  const timer = setInterval(() => {
    const maxScreenTime = numPages * 20;

    if (lesson.contentType === "video") {
      const video = videoRef.current;
      const currentPercent = Math.floor(progressPercent);
      const currentTime = Math.floor(video?.currentTime || 0);

      if (
        video &&
        progressPercent > 0 &&
        progressPercent <= 100 &&
        currentPercent !== lastSent.current &&
        currentTime > 0 &&
        (lastTimestampFromServer === null ||
          currentTime >= lastTimestampFromServer)
      ) {
        lastSent.current = currentPercent;
        lastTimestamp.current = currentTime;

        axios
          .put(
            `/api/user/progress/${lesson.id}`,
            {
              percent: currentPercent,
              lastTimestamp: Math.floor(video.currentTime),
              thumbnailUrl: lesson.thumbnailUrl || "",
              screenTime: videoScreenTime,
              contentType: lesson.contentType
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
    }else if (lesson.contentType === "document") {
      setDocumentScreenTime((prev) => {
        const updatedTime = prev + 1;
        const progressPercent = Math.min((updatedTime / maxScreenTime) * 100, 100);
        setDocProgress(progressPercent);
        // console.log(`📄 Document screen time: ${updatedTime} seconds`);
        // console.log(`📄 Document max screen time: ${maxScreenTime} seconds`);
        // console.log(`📄 Document progress: ${progressPercent}%`);
        return updatedTime;
      });
    }
  },100);

  return () => {
    clearInterval(timer);

    // Send screen time for document content when leaving the page
    if (lesson.contentType === "document" && documentScreenTime > 0) {
      axios
        .put(
          `/api/user/progress/${lesson.id}`,
          {
            percent: Math.floor(docprogress), // No progress for documents
            lastTimestamp: 0, // No timestamp for documents
            thumbnailUrl: lesson.thumbnailUrl || "",
            screenTime: documentScreenTime, // Send screen time
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        // .then(() => console.log("✅ Screen time logged successfully"))
        .catch((err) =>
          console.error("❌ Failed to log document screen time:", err)
        );
    }
  };
}, [lesson, token, progressPercent, lastTimestampFromServer, documentScreenTime, numPages, docprogress]);

useEffect(() => {
  let timer: NodeJS.Timeout | null = null;

  if (lesson?.contentType === "document") {
    setCanSwitchPage(false); // Disable switching initially
    setTimeSpentOnCurrentPage(0); // Reset time spent on the page

    timer = setInterval(() => {
      setTimeSpentOnCurrentPage((prev) => {
        const updatedTime = prev + 1;
        if (updatedTime >= 2) { // Allow switching after 20 seconds
          setCanSwitchPage(true);
          clearInterval(timer!); // Stop the timer
        }
        return updatedTime;
      });
    }, 1000);
  }

  // console.log("Printout Quiz availability: ",lesson?.quizAvailable)

  return () => {
    if (timer) clearInterval(timer);
  };
}, [currentPage, lesson]);
  useEffect(() => {
    if (
      progressPercent >= 100 &&
      !showQuiz &&
      lesson &&
      (lesson.quizAttemptLimit || 1) &&
      !quizPassed && !hasTakenQuiz && lesson.quizAvailable
    ) {
      // console.log("Show Quiz: ",showQuiz)
      setShowQuiz(true);
    }
  }, [progressPercent, showQuiz, lesson]);


  
  if (loading || !lesson) {
    return <div className="p-6 text-gray-400">⏳ Loading lesson…</div>;
  }

  const filename = lesson.videoUrl?.split("/").pop() || "";
  // console.log(filename)
  const documentfile =
    lesson.documentUrl?.split("/").pop() || "Can't find document";

  if (!token) return <Navigate to="/" replace />;
  // Render video หรือ document
  const renderContent = () => {
    if (lesson.contentType === "video") {
      if (lastTimestampFromServer === null) {
        return <div className="p-6 text-gray-400">⏳ Loading video…</div>;
      }

      return (
        <div>
           <video
          ref={videoRef}
          controls
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          poster={lesson.thumbnailUrl}
          className="w-full h-auto bg-black noscrub"
          controlsList="noplaybackrate nodownload noremoteplayback"
          disablePictureInPicture
          muted={false}
          src={`/api/learning/video/v2/${filename}`}
        />
        </div>
       
        
      );
    } else if (lesson.contentType === "document") {
      return (
        <div className="bg-white p-4 rounded shadow w-full">
          <Document
            file={`/api/learning/document/${documentfile}`}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) =>
              console.error("Error loading PDF:", error)
            }
            loading={<p>Loading PDF...</p>}
          >
            <Page
              pageNumber={currentPage + 1}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          </Document>

          {/* PDF Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
               onClick={() => {
              if (!canSwitchPage) {
                alert("⏳ Please spend on this page before moving to the next one.");
                return;
              }
              setCurrentPage((prev) => Math.max(prev - 1, 0));
            }}
              disabled={currentPage <= 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ◀️ Previous
            </button>
            <p className="text-sm text-gray-600">
              Page {currentPage + 1} of {numPages}
            </p>
            <button
              onClick={() => {
              if (!canSwitchPage) {
                alert("⏳ Please spend on this page before moving to the next one.");
                return;
              }
              setCurrentPage((prev) => Math.max(prev + 1, 0));
            }}
              disabled={currentPage >= numPages - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next ▶️
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  const filteringProgress = () => {
    if (lesson.contentType === "video") {
      return (
        <div className="h-1 bg-gray-300">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <div>
            <p className="text-sm text-gray-500">
              Attempts: {attempts}/{maxAttempts || lesson.quizAttemptLimit || 1}
            </p>
          </div>
        </div>
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
              <h1 className="text-2xl font-bold text-gray-800">
                {lesson.title}
              </h1>
              <span className="text-xs font-semibold uppercase text-purple-600">
                {lesson.category}
              </span>
              <p className="text-gray-700">{lesson.description}</p>

              <div className="flex items-center gap-4">
                {lesson.authorAvatarUrl ? (
                  <img
                    src={lesson.authorAvatarUrl}
                    alt="Author Avatar"
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={(e) =>
                      ((e.currentTarget.style.display = "none"))
                    }
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white">
                    {lesson.authorName?.charAt(0) ?? "?"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {lesson.authorName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {lesson.authorEmail || ""}
                  </p>
                </div>
              </div>
              {filteringProgress()}
            </section>
          </div>

          <aside className="space-y-6 mt-4 xl:mt-0">
             {id && <LessonFeedbackWidget token={token} lessonId={id} />}
             <FeedbackWidget token={token} lessonId={id ?? ""} />
          </aside>
        </div>
      </main>

      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center">
            {hasTakenQuiz ? (
              <>
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  ❌ Quiz unavailable
                </h2>
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
                <h2 className="text-xl font-bold mb-4">
                  🎉 Lesson Completed!
                </h2>
                <p className="text-gray-700 mb-2">
                  Take a quiz to test your knowledge.
                </p>
                 <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={() => {
                        setShowQuiz(false);
                        navigate(`/quiz/${lesson.id}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Start Quiz
                    </button>
                    <button
                      onClick={() => {
                        setShowQuiz(false);
                        navigate("/lesson");
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                      Do Later
                    </button>
                  </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetailPage;
