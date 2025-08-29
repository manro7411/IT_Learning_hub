interface LessonStatsWidgetProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
  };
}

const LessonStatsWidget = ({ stats }: LessonStatsWidgetProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <StatCard label="ทั้งหมด" value={stats.total} subtitle="บทเรียน" />
      <StatCard label="กำลังเรียน" value={stats.inProgress} subtitle="ยังไม่จบ" />
      <StatCard label="เรียนจบแล้ว" value={stats.completed} subtitle="ครบ 100%" />
    </div>
  );
};

function StatCard({ label, value, subtitle }: { label: string; value: number | string; subtitle?: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-800">{value}</div>
      {subtitle && <div className="text-[11px] text-gray-400">{subtitle}</div>}
    </div>
  );
}

export default LessonStatsWidget;