import { Document, Page } from 'react-pdf';

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

interface Props {
  lesson: Lesson;
  filename: string;
  documentfile: string;
  currentPage: number;
  setCurrentPage: (n: number) => void;
  numPages: number;
  setNumPages: (n: number) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  onLoadedMetadata: () => void;
  onTimeUpdate: () => void;
}

const LessonContent = ({
  lesson, filename, documentfile, currentPage, setCurrentPage, numPages, setNumPages,
  videoRef, onLoadedMetadata, onTimeUpdate
}: Props) => {
  if (lesson.contentType === "video") {
    return (
      <video
        ref={videoRef}
        controls
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        poster={lesson.thumbnailUrl}
        className="w-full h-auto bg-black"
        src={`/api/learning/video/${filename}`}
      />
    );
  }
  if (lesson.contentType === "document") {
    return (
      <div className="bg-white p-4 rounded shadow w-full">
        <Document
          file={`/api/learning/document/${documentfile}`}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<p>Loading PDF...</p>}
        >
          <Page
            pageNumber={currentPage + 1}
            renderAnnotationLayer
            renderTextLayer
          />
        </Document>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
            disabled={currentPage <= 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ◀️ Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} of {numPages}
          </p>
          <button
            onClick={() => setCurrentPage(Math.min(currentPage + 1, numPages - 1))}
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

export default LessonContent;