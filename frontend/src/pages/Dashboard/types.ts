// pages/UserDashboard/types.ts
export interface Lesson {
  id: string;
  title: string;
  dueDate?: string;
  assignType: string;
  description?: string;
  category?: string;
  contentType?: "video" | "document";
  thumbnailUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
  authorName?: string;
  authorEmail?: string;
  authorAvatarUrl?: string;
  quizAttemptLimit?: number;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
}
