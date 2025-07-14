import { useEffect, useState } from "react";
import axios from "axios";
import SupervisorSidebarWidget from "./Widgets/SupervisorSideBar";
import UserListWidget from "./Widgets/UserListWidget";
import { useNavigate } from "react-router-dom";


type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const SupervisorDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 


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

      const { data } = await axios.get<User[]>("http://localhost:8080/profile/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = data.filter((user) => user.role !== "Supervisor");
      console.log("✅ Users fetched:", filtered);
      setUsers(filtered);

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

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/"); 
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <p className="mb-6">Manage user roles.</p>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-semibold">{user.name || user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>

            {user.role !== "Admin" ? (
              <button
                onClick={() => assignRole(user.id, "Admin")}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Assign Admin
              </button>
            ) : (
              <span className="text-green-600 font-medium">Already Admin</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorDashboard;
