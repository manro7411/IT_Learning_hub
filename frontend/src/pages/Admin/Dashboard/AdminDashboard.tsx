import { useContext, useState } from "react";
import { AuthContext } from "../../../Authentication/AuthContext.tsx";
import AdminSidebarWidget from "../Widgets/AdminSideBar.tsx";
import AdminCalendar from "../Widgets/AdminCalendar.tsx";
import ScoreboardChart from "../../../components/ScoreboardChart";
import { useNavigate } from "react-router-dom";
import { FaFilter } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const teamData = [
  { name: 'Team A', value: 30 },
  { name: 'Team B', value: 25 },
  { name: 'Team C', value: 8 },
  { name: 'Team D', value: 10 },
  { name: 'Team E', value: 3 },
];

const donutData = [
  { name: 'Team A', value: 30, course: 'Agile Methodologies Overview' },
  { name: 'Team B', value: 35, course: '10 Advantages of Waterfall Model' },
  { name: 'Team C', value: 10, course: 'Agile Methodologies Overview' },
  { name: 'Team D', value: 20, course: '10 Advantages of Waterfall Model' },
  { name: 'Team E', value: 5, course: 'Agile Methodologies Overview' },
];

const COLORS = ['#C2CEFD', '#FF9736', '#0575E6', '#084590', '#055CC7'];

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const displayName = user?.name || "Administrator";
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState({ team: '', course: '' });

  const handleClear = () => {
    setFilterText({ team: '', course: '' });
  };

  const filteredTeamData = teamData.filter(item =>
    !filterText.team || item.name.toLowerCase().includes(filterText.team.toLowerCase())
  );

  const filteredCourses = filterText.course
    ? [...new Set(donutData.filter(d => d.course.toLowerCase().includes(filterText.course.toLowerCase())).map(d => d.course))]
    : [...new Set(donutData.map(d => d.course))];

  const courseDataMap = filteredCourses.map(course => ({
    course,
    data: donutData.filter(d => d.course === course),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">👋 Welcome, {displayName}</h1>
            <p className="text-gray-600 mb-4 ml-10">Have a good day!</p>
          </div>

          <div className="flex items-center gap-3 mb-6 relative">
            <button
              onClick={() => navigate("/admin-overall")}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
            >
              See Overall
            </button>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border shadow rounded-full hover:bg-gray-100"
                onClick={() => setShowFilter(!showFilter)}
              >
                <FaFilter /> Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white border shadow-lg rounded-xl z-10 p-4 space-y-2">
                  <p className="font-semibold text-gray-700">Filter by :</p>
                  <input
                    type="text"
                    placeholder="Team"
                    className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm"
                    value={filterText.team}
                    onChange={(e) => setFilterText({ ...filterText, team: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Course"
                    className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm"
                    value={filterText.course}
                    onChange={(e) => setFilterText({ ...filterText, course: e.target.value })}
                  />
                  <div className="flex justify-between pt-2">
                    <button onClick={handleClear} className="text-sm text-red-500 hover:underline">Clear</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-2 ml-2">Summary</h2>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-blue-500">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">By Team</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredTeamData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0575E6" radius={[0, 8, 8, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow p-4 border-t-8 border-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">By Course</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {courseDataMap.map(({ course, data }, index) => (
                  <div key={index} className="flex flex-col items-center w-[280px] max-w-full">
                    <h3 className="text-sm font-semibold mb-2 text-center">{course}</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          label
                          isAnimationActive={true}
                        >
                          {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row justify-end gap-6 mb-6">
            <div className="space-y-6">
              <AdminCalendar />
              <ScoreboardChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
