import { useState } from "react";
//  useContext,
// import { AuthContext } from "../../../Authentication/AuthContext.tsx";
import AdminSidebarWidget from "../Widgets/AdminSideBar.tsx";
import AdminCalendar from "../Widgets/AdminCalendar.tsx";
import ScoreboardChart from "../../../components/ScoreboardChart";
import StatisticsChart from "../../../components/StatisticsChart";
import { useNavigate } from "react-router-dom";

const mockSubmissions = Array(8).fill({
  name: "Firstname Lastname",
  date: "25/2/2023",
  courseType: "AGILE",
  courseTitle: "Agile Methodologies Overview",
});

const AdminDashboard_overall = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [activeDetailIndex, setActiveDetailIndex] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebarWidget />

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
          >
            See Summary
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <StatisticsChart />

            <div className="bg-white shadow rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Name’s Submitted</h2>
                <a href="#" className="text-blue-600 text-sm">See All</a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left relative">
                  <thead>
                    <tr className="text-gray-500 text-sm border-b">
                      <th className="py-2 px-4">NAME & DATE</th>
                      <th className="py-2 px-4">COURSE TYPE</th>
                      <th className="py-2 px-4">COURSE TITLE</th>
                      <th className="py-2 px-4">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSubmissions.map((entry, index) => (
                      <tr key={index} className="text-gray-700 border-b hover:bg-gray-50 transition relative">
                        <td className="py-3 px-4 relative">
                          <div className="font-semibold">{entry.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            {entry.date}
                            <button
                              className="text-blue-600 text-xs underline hover:text-blue-800"
                              onClick={() =>
                                setActiveDetailIndex(activeDetailIndex === index ? null : index)
                              }
                            >
                              Detail
                            </button>
                          </div>

                          {activeDetailIndex === index && (
                            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-indigo-200 text-black rounded-2xl p-4 shadow-lg w-72 z-10 whitespace-nowrap">
                              <p><strong>Name:</strong> {entry.name}</p>
                              <p><strong>Team:</strong> IT</p>
                              <p><strong>Position:</strong> Frontend Developer</p>
                              <p><strong>Date:</strong> {entry.date}</p>
                              <p><strong>Status:</strong> 3 / 5</p>
                              <p><strong>Level:</strong> Silver</p>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-white text-xs bg-blue-600 px-3 py-1 rounded-full">
                            {entry.courseType}
                          </span>
                        </td>
                        <td className="py-3 px-4">{entry.courseTitle}</td>
                        <td className="py-3 px-4">
                          <button className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
                            SHOW DETAILS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="order-1 xl:order-2">
            <div className="space-y-6 mt-4 xl:mt-0">
              <AdminCalendar />
              <ScoreboardChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard_overall;
