import { useEffect, useState } from "react";
import axios from "axios";

interface TeamMember {
  id: string;
  nameMembers: string;
  email: string;
}

interface TeamMembersModalProps {
  teamId: string;
  open: boolean;
  onClose: () => void;
}

const TeamMembersModal = ({ teamId, open, onClose }: TeamMembersModalProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  useEffect(() => {
    if (!open || !teamId) return;

    const fetchMembers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/teams/${teamId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("member",res.data)
        setMembers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch team members:", err);
        setError("Failed to load team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [teamId, open,token]);

  const handleRemoveMember = async (memberId: string) => {
    try {
      await axios.delete(`/api/teams/${teamId}/members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      console.error("❌ Failed to remove member:", err);
      alert("Failed to remove member.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Team Members</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : members.length === 0 ? (
          <p className="text-gray-400">No members found.</p>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{member.nameMembers}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="mt-6 text-blue-600 hover:underline text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TeamMembersModal;
