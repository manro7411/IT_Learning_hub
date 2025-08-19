import axios from "axios";
import { useEffect, useState } from "react";
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


export const useUpcomingLesson = (token: string | null) => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    
    
  useEffect(() => {
    if (!token) return;

    const fetchLessons = async () => {
      try {
        const res = await axios.get("/api/learning/upcoming-due", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons(res.data);
      } catch (err) {
        console.error("❌ Error fetching lessons", err);
      }
    };

    fetchLessons();
  }, [token]);
  
  return lessons

}