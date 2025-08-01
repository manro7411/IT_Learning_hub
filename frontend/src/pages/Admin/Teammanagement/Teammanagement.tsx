import { useEffect, useState } from "react";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
import { Plus } from "lucide-react";
import CreateTeamModal from "./CreateTeamModal";
import TeamCardWidget from "./TeamCardWidget";
import axios from "axios";

interface Team {
  id: string;
  name: string;
  description: string;
  createBy: string;
  joinCode: string;
}

interface UserProfile {
  email: string;
  name: string;
}

const TeamManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Load logged-in user's profile
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get<UserProfile>("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserEmail(res.data.email);
    } catch (error) {
      console.error("❌ Failed to load user profile:", error);
    }
  };

  // Load all teams
  const fetchTeams = async () => {
    try {
      const res = await axios.get<Team[]>("/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(res.data);
    } catch (error) {
      console.error("❌ Failed to load teams:", error);
      setError("Failed to load team list.");
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchUserProfile();
    fetchTeams();
  }, [token]);

  // Filter only teams created by the logged-in user
  const myTeams = teams.filter((team) => team.createBy === userEmail);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebarWidget />
      <main className="flex-1 p-6 relative space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-600">Manage teams and members efficiently.</p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTeams.map((team) => (
            <TeamCardWidget
              key={team.id}
              name={team.name}
              description={team.description}
              createBy={team.createBy}
              joinCode={team.joinCode}
            />
          ))}
          {myTeams.length === 0 && (
            <p className="text-gray-400 col-span-full">No teams found.</p>
          )}
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        >
          <Plus size={24} />
        </button>

        <CreateTeamModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
      </main>
    </div>
  );
};

export default TeamManagement;
