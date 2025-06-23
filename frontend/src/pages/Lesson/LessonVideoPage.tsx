import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

const LessonVideoPage = () => {
    const { id } = useParams(); // ← ใช้ถ้าคุณ routing ผ่าน /lesson/:id
    const videoRef = useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = useState(0);

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (video && video.duration) {
            const percent = (video.currentTime / video.duration) * 100;
            setProgress(percent);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-xl font-bold mb-4">📽️ Lesson {id}</h1>
            <video
                ref={videoRef}
                controls
                className="rounded-xl w-full"
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                onTimeUpdate={handleTimeUpdate}
            />
            <div className="mt-4 text-sm text-gray-600">
                Progress: {Math.floor(progress)}%
            </div>
        </div>
    );
};

export default LessonVideoPage;
