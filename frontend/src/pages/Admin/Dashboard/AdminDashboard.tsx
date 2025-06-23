import { useContext } from "react";
import {AuthContext} from "../../../Authentication/AuthContext.tsx";
import AdminSidebarWidget from "../Widgets/AdminSideBar.tsx";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    const displayName = user?.name || user?.email || "Administrator";

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <AdminSidebarWidget />

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    🔐 Admin Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* Card 1: User Management */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            👥 User Management
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            View, edit, or remove platform users.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Manage Users
                        </button>
                    </div>

                    {/* Card 2: Course Oversight */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            📘 Course Oversight
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Monitor course content and learning progress.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            View Courses
                        </button>
                    </div>

                    {/* Card 3: System Logs */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">
                            📄 System Logs
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Review system activity and access logs.
                        </p>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            View Logs
                        </button>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="mt-12">
                    <p className="text-gray-600">
                        Welcome back, <span className="font-semibold">{displayName}</span>!
                        Use the tools above to manage and monitor the platform effectively.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
