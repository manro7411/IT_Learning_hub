import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import AdminSidebarWidget from "../Widgets/AdminSideBar";

interface User {
  id: string;
  name: string;
  email: string;
}

const TeamManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("unknown@example.com");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get<User>("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.email);
      } catch (error) {
        console.error("❌ Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios
      .get<User[]>("http://localhost:8080/profile/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((error) => {
        console.error("❌ Failed to load users:", error);
        setError("Failed to load user list.");
      });
  }, [token]);

  const handleAddMember = (user: User) => {
    if (teamMembers.find((m) => m.id === user.id)) {
      setError("This user is already a team member.");
      return;
    }
    setTeamMembers([...teamMembers, user]);
    setError("");
  };

  const handleRemoveMember = (userId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== userId));
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return setError("Please enter a team name.");
    if (teamMembers.length === 0) return setError("Please add at least one team member.");

    const newTeam = {
      name: teamName.trim(),
      description: description.trim(),
      createBy: username,
      members: teamMembers.map((m) => ({
        userId: m.id,
        userName: m.name,
      })),
    };

    try {
      console.log("📤 Creating team:", newTeam);
      await axios.post("http://localhost:8080/teams", newTeam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`✅ Team "${teamName}" created successfully.`);
      setTeamName("");
      setDescription("");
      setTeamMembers([]);
      setError("");
    } catch (error) {
      console.error("❌ Failed to create team:", error);
      setError("Failed to create team.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-6 space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600">Create teams and add members easily.</p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Create New Team</h2>
          <div className="space-y-3">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="border px-4 py-2 rounded w-full"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter team description"
              className="border px-4 py-2 rounded w-full"
              rows={3}
            />
            <button
              onClick={handleCreateTeam}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Plus size={16} className="inline mr-1" /> Create Team
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee name"
            className="border px-4 py-2 rounded w-full mb-2"
          />
          <div className="bg-white rounded-xl p-4 shadow space-y-2">
            {users
              .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
              .map((user) => (
                <div key={user.id} className="flex justify-between items-center">
                  <span>{user.name}</span>
                  <button
                    onClick={() => handleAddMember(user)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    <Plus size={14} className="inline mr-1" /> Add
                  </button>
                </div>
              ))}
            {users.length === 0 && <p className="text-gray-400">No users available.</p>}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Team Members</h2>
          <div className="bg-white rounded-xl p-4 shadow space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex justify-between items-center">
                <span>{member.name}</span>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {teamMembers.length === 0 && <p className="text-gray-400">No team members yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TeamManagement;
