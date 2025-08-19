// src/pages/lesson/LessonPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../widgets/SidebarWidget";
import defaultUserAvatar from "../../assets/user.png";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import { http } from "../../Authentication/http";

interface Lesson {
  id: string;
  title: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  assignType: "all" | "team" | "specific";
  assignedUserIds?: string[];
  assignedTeamIds?: string[];
  contentType: "video" | "document";
}
interface Progress { percent: number; lastTimestamp: number; }
type ProgressItem = { lessonId: string; percent: number; lastTimestamp?: number; };
type ProfileResp = { id: string; teams?: string[]; name?: string; email?: string; };
type Team = { id: string };

const normalizeAvatarUrl = (p?: string | null): string => {
  if (!p) return defaultUserAvatar;
  if (/^https?:\/\//i.test(p) || p.startsWith("data:")) return p;
  const filename = p.split("/").pop();
  return filename && filename !== "null" ? `/api/profile/avatars/${filename}` : defaultUserAvatar;
};

const LessonPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, Progress>>({});
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAssignType, setSelectedAssignType] = useState<"all" | "team" | "specific">("all");

  const [userId, setUserId] = useState<string | null>(null);
  const [myTeamIds, setMyTeamIds] = useState<string[]>([]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setErrMsg(null);

    (async () => {
      try {
        // ✅ วอร์มเซสชันก่อนเสมอ: ถ้า jwt หาย  → interceptor จะ refresh ให้
        try {
          await http.get<ProfileResp>("/profile");
        } catch {
          // สำรอง: ถ้าครั้งแรกพลาดเพราะหมดอายุ กด /login/refresh แล้วลองอีกที
          await http.post("/login/refresh");
          await http.get<ProfileResp>("/profile");
        }
        if (!alive) return;

        // ดึงข้อมูลหลักพร้อมกันทีหลัง (ตอนนี้ jwt สดแล้ว)
        const [profileRes, teamsRes, lessonsRes, progressRes] = await Promise.all([
          http.get<ProfileResp>("/profile"),
          http.get<Team[]>("/teams"),
          http.get<Lesson[]>("/learning"),
          http.get<ProgressItem[]>("/user/progress"),
        ]);

        if (!alive) return;

        const profile = profileRes.data;
        setUserId(profile?.id ?? null);

        const teamIds = new Set<string>([
          ...(profile?.teams ?? []),
          ...((teamsRes.data ?? []).map((t) => t.id)),
        ]);
        setMyTeamIds([...teamIds]);

        setLessons(lessonsRes.data ?? []);

        const map: Record<string, Progress> = {};
        (progressRes.data ?? []).forEach((item) => {
          map[item.lessonId] = {
            percent: item.percent ?? 0,
            lastTimestamp: item.lastTimestamp ?? 0,
          };
        });
        setProgressMap(map);
      } catch (e) {
        console.error("❌ Failed to load lessons/progress/profile:", e);
        if (alive) setErrMsg("Failed to load lessons");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [location.key]); // ใช้ key ให้ re-run เมื่อเข้าหน้านี้ใหม่

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(lessons.map((l) => l.category).filter(Boolean))),
    [lessons]
  );

  const filteredLessons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const progress = progressMap[lesson.id]?.percent ?? 0;
      const isIncomplete = progress < 100;

      const matchesAssignType =
        selectedAssignType === "all"
          ? true
          : selectedAssignType === "specific"
          ? !!userId &&
            lesson.assignType === "specific" &&
            (lesson.assignedUserIds ?? []).some((id) => id === userId)
          : selectedAssignType === "team"
          ? lesson.assignType === "team" &&
            (lesson.assignedTeamIds ?? []).some((id) => myTeamIds.includes(id))
          : false;

      const haystack = (lesson.title + " " + lesson.category + " " + (lesson.description ?? "")).toLowerCase();
      const matchesSearch = q === "" || haystack.includes(q);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(lesson.category);

      return isIncomplete && matchesAssignType && matchesSearch && matchesCategory;
    });
  }, [lessons, progressMap, selectedAssignType, userId, myTeamIds, searchQuery, selectedCategories]);

  const handleLessonClick = async (id: string) => {
    const lastTimestamp = progressMap[id]?.lastTimestamp || 0;
    try {
      await http.post(`/learning/${id}/click`, {}); // interceptor จัดการคุกกี้
    } catch (err) {
      console.error("Failed to log click:", err);
    } finally {
      navigate(`/lesson/${id}`, { state: { lastTimestamp } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full xl:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex items-center space-x-4">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setCategoryMenuOpen((v) => !v)}
                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 text-sm"
              >
                {selectedCategories.length > 0 ? `Category (${selectedCategories.length})` : "Filter by Category"}
              </button>
              {categoryMenuOpen && (
                <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2 space-y-1 max-h-64 overflow-auto">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() =>
                            setSelectedCategories((prev) =>
                              prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
                            )
                          }
                          className="accent-purple-500"
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                    <button className="mt-2 text-xs text-blue-500 hover:underline" onClick={() => setSelectedCategories([])}>
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              {(["all", "team", "specific"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAssignType(type)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedAssignType === type ? "bg-purple-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <NotificationWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-3 grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
            {loading ? (
              <div className="text-gray-500">Loading lessons…</div>
            ) : errMsg ? (
              <div className="text-red-600">{errMsg}</div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-gray-500">No lessons found</div>
            ) : (
              filteredLessons.map((lesson) => {
                const progress = progressMap[lesson.id] ?? { percent: 0, lastTimestamp: 0 };
                const avatarUrl = normalizeAvatarUrl(lesson.authorAvatarUrl);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson.id)}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    <div className="w-64 h-[300px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
                      <div className="w-full h-32 bg-gray-100">
                        <img
                          src={lesson.thumbnailUrl || "/placeholder.png"}
                          alt={lesson.title}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <span className="text-[10px] font-semibold uppercase text-purple-600">{lesson.category}</span>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{lesson.title}</h3>

                        <div className="mb-2 mt-3 h-1 rounded-full bg-gray-200">
                          <div
                            className="h-full transition-all duration-300 rounded-full bg-blue-500"
                            style={{ width: `${Math.max(progress.percent, 1)}%`, minWidth: progress.percent > 0 ? 4 : 0 }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-500 mb-1">Progress: {progress.percent}%</div>

                        <div className="mt-auto flex items-center space-x-2">
                          <img
                            src={avatarUrl}
                            alt="Author"
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultUserAvatar; }}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-medium">{lesson.authorName || "Unknown Author"}</div>
                            <div className="text-[10px] text-gray-500">Learning Content</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </main>

      <ChatBubbleWidget />
    </div>
  );
};

export default LessonPage;
