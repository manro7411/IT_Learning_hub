import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../Authentication/AuthContext";
import Sidebar from "../../widgets/SidebarWidget";
import defaultUserAvatar from "../../assets/user.png";
import ChatBubbleWidget from "../../widgets/ChatBubbleWidget";
import NotificationWidget from "../../widgets/NotificationWidget";
import { useLesson } from "./hooks/useLessons";
import { useUserProfile } from "./hooks/useUserProfile";
import { useTeam } from "./hooks/useTeam";
import { CATEGORY_GROUP } from "./Category";
import { resolveCategoryPath, countByPath } from "./utils/resolveCategory";
import placeholder from './placeholder.png';
// import LessonStatsWidget from "../../widgets/LessonStatsWidget";

// ------------------------------------------------------
// LessonDashboard.tsx (เต็มไฟล์)
// - หน้ารวมบทเรียนพร้อมตัวกรองแบบกลุ่ม/หมวดย่อย
// - แสดงสรุปสถิติ, ค้นหา, กรอง assign type, toggle แสดงที่เรียนจบแล้ว
// - จัดกลุ่มการ์ดตาม Group > Subcategory
// ------------------------------------------------------

export default function LessonDashboard() {
  const { token: ctxToken } = useContext(AuthContext);
  const token = ctxToken || localStorage.getItem("token") || sessionStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignType, setSelectedAssignType] = useState<"all" | "team" | "specific">("all");
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);

  const { lessons, progressMap, loading } = useLesson(token, location.pathname);
  const { userId } = useUserProfile(token);
  const myTeamIds = useTeam(token);

  // ------- Derivations -------
  const lessonsWithPath = useMemo(() => {
    return lessons.map((l) => ({ ...l, __cat: resolveCategoryPath(l.category) }));
  }, [lessons]);

  const allPaths = useMemo(() => lessonsWithPath.map((l) => l.__cat.path), [lessonsWithPath]);
  const pathCounts = useMemo(() => countByPath(allPaths), [allPaths]);

  const stats = useMemo(() => {
    let total = lessons.length;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    for (const l of lessons) {
      const key = l.id.toLowerCase();
      const percent = progressMap[key]?.percent ?? 0;

      if (percent >= 100) {
        completed+=1;
      }else if (percent > 0) {
        inProgress += 1;
      }else{
        notStarted +=1
      }
    }
    return { total, completed, inProgress };
  }, [lessons, progressMap]);

  // ------- Filters -------
  const filteredLessons = useMemo(() => {
    return lessonsWithPath.filter((lesson) => {
      const key = lesson.id.toLowerCase();
      const percent = progressMap[key]?.percent ?? 0;

      const matchesCompletion = showCompleted ? true : percent < 100;

      const matchesAssignType =
        selectedAssignType === "all"
          ? lesson.assignType === "all"
          : selectedAssignType === "specific"
          ? lesson.assignType === "specific" && userId && lesson.assignedUserIds?.includes(userId)
          : selectedAssignType === "team"
          ? lesson.assignType === "team" && lesson.assignedTeamIds?.some((id: string) => myTeamIds.includes(id))
          : false;

      const matchesSearch = [lesson.title, lesson.category, lesson.description ?? ""]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

      const { group, path } = lesson.__cat;
      const hasSelection = selectedPaths.length > 0;
      const matchesCategory = !hasSelection || selectedPaths.some((p) => p === group || p === path);

      return matchesCompletion && matchesAssignType && matchesSearch && matchesCategory;
    });
  }, [lessonsWithPath, progressMap, showCompleted, selectedAssignType, userId, myTeamIds, searchQuery, selectedPaths]);

  // Grouped for render: Group -> Sub -> Lessons
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string | "__root__", typeof filteredLessons>>();
    for (const l of filteredLessons) {
      const g = l.__cat.group;
      const s = l.__cat.sub ?? "__root__";
      if (!map.has(g)) map.set(g, new Map());
      const subMap = map.get(g)!;
      if (!subMap.has(s)) subMap.set(s, []);
      subMap.get(s)!.push(l);
    }
    return map;
  }, [filteredLessons]);

  // ------- Handlers -------
  const handleLessonClick = async (id: string, quizAvailable: boolean) => {
    const key = id.toLowerCase();
    const lastTimestamp = progressMap[key]?.lastTimestamp || 0;
    try {
      await axios.post(`/api/learning/${id}/click`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to log click:", err);
    } finally {
      navigate(`/lesson/${id}`, { state: { lastTimestamp ,quizAvailable} });
    }
  };

  const togglePath = (path: string) => {
    setSelectedPaths((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]));
  };
  const clearAllSelections = () => setSelectedPaths([]);
  const selectEntireGroup = (group: string) => {
    setSelectedPaths((prev) => {
      const withoutGroup = prev.filter((p) => !p.startsWith(`${group}/`) && p !== group);
      return [...withoutGroup, group];
    });
  };

   if (!token) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Lesson Dashboard</h1>
            <p className="text-sm text-gray-500">ค้นหา/กรองบทเรียน และติดตามความคืบหน้าได้ในที่เดียว</p>
          </div>
          <NotificationWidget />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <StatCard label="ทั้งหมด" value={stats.total} subtitle="บทเรียน" />
          <StatCard label="กำลังเรียน" value={stats.inProgress} subtitle="ยังไม่จบ" />
          <StatCard label="เรียนจบแล้ว" value={stats.completed} subtitle="ครบ 100%" />
        </div>
        {/* <LessonStatsWidget stats={stats} /> */}

        {/* Controls */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <input
              type="text"
              placeholder="Search lessons…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full xl:w-96 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <CategoryDropdown
              selectedPaths={selectedPaths}
              pathCounts={pathCounts}
              onTogglePath={togglePath}
              onClearAll={clearAllSelections}
              onSelectGroup={selectEntireGroup}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex space-x-2">
              {["all", "team", "specific"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedAssignType(type as any)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedAssignType === type ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              แสดงที่เรียนจบแล้ว
            </label>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-gray-500">Loading lessons…</div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-gray-500">No lessons found</div>
        ) : (
          <div className="space-y-8">
            {Array.from(grouped.keys()).map((group) => {
              const subMap = grouped.get(group)!;
              const groupTotal = Array.from(subMap.values()).reduce((acc, arr) => acc + arr.length, 0);
              return (
                <section key={group}>
                  <div className="flex items-end justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {group} <span className="text-sm font-normal text-gray-500">({groupTotal})</span>
                    </h2>
                  </div>

                  {/* มีหมวดย่อยหรือไม่ */}
                  {Array.from(subMap.keys()).some((k) => k !== "__root__") ? (
                    <div className="space-y-6">
                      {Array.from(subMap.entries())
                        .filter(([sub]) => sub !== "__root__")
                        .map(([sub, items]) => (
                          <div key={String(sub)}>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">{String(sub)}</h3>
                            <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
                              {(items as any[]).map((lesson) => (
                                <LessonCard
                                  key={lesson.id}
                                  lesson={lesson}
                                  progressMap={progressMap}
                                  onClick={() => handleLessonClick(lesson.id,lesson.quizAvailable)}
                                />
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* รายการที่อยู่ในกลุ่มแต่ไม่มีหมวดย่อย */}
                      {subMap.get("__root__") && subMap.get("__root__")!.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-700 mb-2">General</h3>
                          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
                            {subMap.get("__root__")!.map((lesson) => (
                              <LessonCard
                                key={(lesson as any).id}
                                lesson={lesson}
                                progressMap={progressMap}
                                onClick={() => handleLessonClick((lesson as any).id, (lesson as any).quizAvailable)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
                      {subMap.get("__root__")!.map((lesson) => (
                        <LessonCard
                          key={(lesson as any).id}
                          lesson={lesson}
                          progressMap={progressMap}
                          onClick={() => handleLessonClick((lesson as any).id, (lesson as any).quizAvailable)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>
      <ChatBubbleWidget />
    </div>
  );
}

// --------------------------
// Components
// --------------------------
function StatCard({ label, value, subtitle }: { label: string; value: number | string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      {subtitle && <div className="text-[11px] text-gray-400">{subtitle}</div>}
    </div>
  );
}

function CategoryDropdown({
  selectedPaths,
  pathCounts,
  onTogglePath,
  onClearAll,
  onSelectGroup,
}: {
  selectedPaths: string[];
  pathCounts: Record<string, number>;
  onTogglePath: (p: string) => void;
  onClearAll: () => void;
  onSelectGroup: (g: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-100 text-sm"
      >
        {selectedPaths.length > 0 ? `Category (${selectedPaths.length})` : "Filter by Category"}
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 max-h-96 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Select one or more groups/subcategories</span>
            <button className="text-xs text-blue-600 hover:underline" onClick={onClearAll}>
              Clear All
            </button>
          </div>
          {Object.entries(CATEGORY_GROUP).map(([group, subs]) => (
            <div key={group} className="border-t pt-2 first:border-0 first:pt-0">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 font-medium text-sm">
                  <input
                    type="checkbox"
                    className="accent-blue-500"
                    checked={selectedPaths.includes(group)}
                    onChange={() => onTogglePath(group)}
                  />
                  <span>
                    {group}
                    {pathCounts[group] ? (
                      <span className="ml-1 text-[10px] text-gray-500">({pathCounts[group]})</span>
                    ) : null}
                  </span>
                </label>
                {subs.length > 0 && (
                  <button
                    className="text-[10px] text-blue-600 hover:underline"
                    onClick={() => onSelectGroup(group)}
                  >
                    Select all
                  </button>
                )}
              </div>
              {subs.length > 0 && (
                <div className="mt-2 grid grid-cols-1 gap-1">
                  {subs.map((sub) => {
                    const path = `${group}/${sub}`;
                    return (
                      <label key={path} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="accent-blue-500"
                          checked={selectedPaths.includes(path)}
                          onChange={() => onTogglePath(path)}
                        />
                        <span>
                          {sub}
                          {pathCounts[path] ? (
                            <span className="ml-1 text-[10px] text-gray-500">({pathCounts[path]})</span>
                          ) : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonCard({
  lesson,
  progressMap,
  onClick,
}: {
  lesson: any;
  progressMap: Record<string, { percent: number; lastTimestamp: number }>;
  onClick: () => void;
}) {
  const key = lesson.id.toLowerCase();
  const progress = progressMap[key] ?? { percent: 0, lastTimestamp: 0 };
  const avatarFilename = lesson.authorAvatarUrl?.split("/").pop();
  const avatarUrl = avatarFilename && avatarFilename !== "null"
    ? `/api/profile/avatars/${avatarFilename}`
    : (defaultUserAvatar as unknown as string);

  const buttonLabel = progress.percent >= 100 ? "Completed" : progress.percent > 0 ? "In Progress" : "Start";

  return (
    <button onClick={onClick} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
      <div className="w-64 h-[300px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden relative">
        {/* Image Section */}
        <div className="w-full h-32 bg-gray-100 relative">
          <img
            src={lesson.thumbnailUrl || placeholder}
            alt={lesson.title}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).onerror = null;
              (e.currentTarget as HTMLImageElement).src = placeholder;
            }}
            className="h-full w-full object-cover"
          />
          {/* Button Positioned at Top-Right */}
          <div className="absolute top-2 right-2">
            <button
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                buttonLabel === "Completed"
                  ? "bg-green-500 text-white"
                  : buttonLabel === "In Progress"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
              disabled={buttonLabel === "Completed"} // Disable button if lesson is completed
            >
              {buttonLabel}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          <span className="text-[10px] font-semibold uppercase text-blue-600">
            {lesson.__cat?.sub ? `${lesson.__cat.sub}` : lesson.__cat?.group}
          </span>
          <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{lesson.title}</h3>

          <div className="mb-2 mt-3 h-1 rounded-full bg-gray-200">
            <div
              className="h-full transition-all duration-300 rounded-full bg-blue-500"
              style={{ width: `${Math.max(progress.percent, 0)}%`, minWidth: progress.percent > 0 ? 4 : 0 }}
            />
          </div>

          <div className="mt-auto flex items-center space-x-2">
            <img
              src={avatarUrl}
              alt="Author"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = defaultUserAvatar as unknown as string;
              }}
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
}