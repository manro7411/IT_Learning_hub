import { useEffect, useState, type FC } from "react";
import axios from "axios";
import { Trash2, RefreshCw } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
  teamId: string;
  initialName: string;
}

interface Member {
  id: string;
  nameMenbers: string;
  userEmail: string;
}

const EditTeamModal: FC<Props> = ({ open, onClose, onUpdated, teamId, initialName }) => {
  const [teamName, setTeamName] = useState(initialName);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!open) return;
    setTeamName(initialName);
    setError("");
    fetchMembers();
  }, [open, teamId, initialName]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get<Member[]>(`/api/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data);
    } catch (err) {
      console.error("❌ Failed to load members", err);
      setError("Failed to load members.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `/api/teams/${teamId}`,
        { name: teamName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchMembers(); // ✅ reload members
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update team:", err);
      setError("Failed to update team name.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await axios.delete(`/api/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchMembers();
    } catch (err) {
      console.error("❌ Failed to remove member:", err);
      setError("Failed to remove member.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4 w-full max-w-lg">
        <h2 className="text-xl font-bold">Edit Team</h2>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team name"
          className="border px-3 py-2 rounded w-full"
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Members</h3>
            <button onClick={fetchMembers} className="text-gray-500 hover:text-gray-800">
              <RefreshCw size={16} />
            </button>
          </div>

          {members.map((m) => (
            <div key={m.id} className="flex justify-between items-center">
              <span>
                {m.nameMenbers} <span className="text-gray-400">({m.userEmail})</span>
              </span>
              <button
                onClick={() => handleRemoveMember(m.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {members.length === 0 && <p className="text-gray-400">No members yet.</p>}
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end space-x-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
