// src/pages/MissionListPage.tsx
import React from "react";

type Mission = {
  id: string;
  title: string;
  lesson: string;
  type: "lesson" | "interactive" | "quiz" | "minigame";
  progress: "Completed" | "In Progress" | "Not Started";
  reward: string;
  deadline: string;
};

const missions: Mission[] = [
  {
    id: "agile-001",
    title: "เรียนรู้บทบาทของ Scrum Master",
    lesson: "Scrum Roles",
    type: "lesson",
    progress: "Completed",
    reward: "20 XP",
    deadline: "2025-07-25",
  },
  {
    id: "agile-002",
    title: "จับคู่ Scrum Events กับคำอธิบาย",
    lesson: "Scrum Events",
    type: "interactive",
    progress: "In Progress",
    reward: "15 XP",
    deadline: "2025-07-27",
  },
  {
    id: "agile-003",
    title: "ตอบคำถาม Agile Principles ให้ครบ 5 ข้อ",
    lesson: "Agile Principles",
    type: "quiz",
    progress: "Not Started",
    reward: "10 XP",
    deadline: "2025-07-30",
  },
  {
    id: "agile-004",
    title: "เล่นเกม Drag & Drop: จัดวาง Artifact",
    lesson: "Scrum Artifacts",
    type: "minigame",
    progress: "Not Started",
    reward: "25 XP",
    deadline: "2025-07-30",
  },
];

const MissionListPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🎯 เควสเรียนรู้ Agile</h1>

      <div className="grid gap-6">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`p-5 rounded-xl shadow border-l-4 ${
              mission.progress === "Completed"
                ? "border-green-500 bg-green-50"
                : mission.progress === "In Progress"
                ? "border-yellow-400 bg-yellow-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{mission.title}</h2>
                <p className="text-sm text-gray-600 mt-1">📘 บทเรียน: {mission.lesson}</p>
                <p className="text-sm mt-1 text-gray-600">⏰ Deadline: {mission.deadline}</p>
                <p className="text-sm mt-1 text-blue-700">🎁 รางวัล: {mission.reward}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm px-3 py-1 rounded-full font-medium ${
                    mission.progress === "Completed"
                      ? "bg-green-100 text-green-800"
                      : mission.progress === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {mission.progress}
                </span>
                <button className="mt-2 block px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  {mission.progress === "Completed" ? "ดูอีกครั้ง" : "ทำเควส"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionListPage;
