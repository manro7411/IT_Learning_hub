import { useEffect, useState } from "react";
import axios from "axios";
import SupervisorSidebarWidget from "./Widgets/SupervisorSideBar";
import UserListWidget from "./Widgets/UserListWidget";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const SupervisorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const { data } = await axios.get<User[]>(
        "http://localhost:8080/profile/users/for-supervisor",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Users fetched:", data);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const assignRole = async (userId: string, role: string) => {
    const confirmAssign = window.confirm(`Are you sure you want to assign role "${role}" to this user?`);
    if (!confirmAssign) return;

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/profile/users/${userId}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Role updated to ${role}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  return (
    <div className="flex h-screen">
      <SupervisorSidebarWidget />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        </div>

        <p className="mb-6">Manage user roles.</p>

        <UserListWidget users={users} assignRole={assignRole} error={error} />
      </div>
    </div>
  );
};

export default SupervisorDashboard;
