import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, X } from "lucide-react";
import { sendLessonNotification } from "../Widgets/notificationServices";

interface User {
  id: string;
  name: string;
  email: string;
}

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateTeamModal = ({ open, onClose }: CreateTeamModalProps) => {
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
    axios.get<User>("/api/profile", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsername(res.data.email))
      .catch(err => console.error("❌ Failed to fetch profile:", err));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    axios.get<User[]>("/api/profile/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("❌ Failed to load users:", err);
        setError("Failed to load users.");
      });
  }, [token]);

  const handleAddMember = (user: User) => {
    if (teamMembers.some(m => m.id === user.id)) {
      setError("User already added.");
      return;
    }
    setTeamMembers([...teamMembers, user]);
    setError("");
  };

  const handleRemoveMember = (userId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== userId));
  };

 const handleCreateTeam = async () => {
  if (!teamName.trim()) return setError("Please enter a team name.");
  if (teamMembers.length === 0) return setError("Add at least one team member.");

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
    await axios.post("/api/teams", newTeam, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Notify each user individually
    for (const member of teamMembers) {
      await sendLessonNotification({
        token: token as string,
        message: `📢 You have been added to the team "${teamName}"`,
        target: "USER",
        userIds: [member.id],
        teamIds: [],
      });
    }

    alert(`✅ Team "${teamName}" created and members notified!`);
    setTeamName("");
    setDescription("");
    setTeamMembers([]);
    setError("");
    onClose();
  } catch (err) {
    console.error("❌ Failed to create team:", err);
    setError("Failed to create team.");
  }
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Team</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="space-y-3 mb-4">
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            className="border px-4 py-2 rounded w-full"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Team description"
            className="border px-4 py-2 rounded w-full"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add Members</h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users"
            className="border px-4 py-2 rounded w-full mb-2"
          />
          <div className="space-y-2">
            {users
              .filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
              .map(user => (
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
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">Team Members</h3>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex justify-between items-center">
                <span>{member.name}</span>
                <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {teamMembers.length === 0 && <p className="text-gray-400">No members yet.</p>}
          </div>
        </div>

        <button
          onClick={handleCreateTeam}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Create Team
        </button>
      </div>
    </div>
  );
};

export default CreateTeamModal;
