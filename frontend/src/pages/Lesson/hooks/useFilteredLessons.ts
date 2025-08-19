// src/hooks/useFilteredLessons.ts
import { useMemo } from "react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  teamId?: string;
}

interface Progress {
  percent: number;
  lastTimestamp: number;
}

interface LessonWithProgress extends Lesson {
  progress: Progress;
}

export const useFilteredLessons = (
  lessons: Lesson[] = [],
  progressMap: Record<string, Progress> = {},
  myTeamIds: string[] = []
): LessonWithProgress[] => {
  return useMemo(() => {
    return lessons
      .filter((lesson) => !lesson.teamId || myTeamIds.includes(lesson.teamId))
      .map((lesson) => {
        // กันกรณี id หาย
        const id = lesson.id?.toLowerCase?.();
        const progress =
          (id && progressMap[id]) || { percent: 0, lastTimestamp: 0 };

        return { ...lesson, progress };
      });
  }, [lessons, progressMap, myTeamIds]);
};