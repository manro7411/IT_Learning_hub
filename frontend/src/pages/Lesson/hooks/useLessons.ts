import axios from "axios";
import { useEffect, useState } from "react";

interface Lesson {
  __cat: { group: any; path: any };
  id: string;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  assignType: string;
  assignedUserIds?: string[];
  assignedTeamIds?: string[];
  contentType: "video" | "document";
}

interface Progress {
  percent: number;
  lastTimestamp: number;
}

export function useLesson(token: string | null, pathname: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [progressRes, setProgressRes] = useState<any[]>([]); // Add state for progressRes
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchData = async () => {
      try {
        const [lessonsRes, progressResData] = await Promise.all([
          axios.get("/api/learning", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/api/user/progress", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setLessons(lessonsRes.data);
        console.log(progressResData.data)
        setProgressRes(progressResData.data); // Save progressRes data to state

        const map: Record<string, Progress> = {};
        progressResData.data.forEach((item: { lessonId: string; percent: number; lastTimestamp?: number }) => {
          const key = item.lessonId.toLowerCase();
          map[key] = {
            percent: item.percent,
            lastTimestamp: item.lastTimestamp || 0,
          };
        });
        setProgressMap(map);
      } catch (err) {
        console.error("❌ Failed to fetch lessons or progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, pathname]);

  return { lessons, progressMap, progressRes, loading};
}