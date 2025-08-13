import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Authentication/AuthContext";
import AdminsistratorBar from "./Widgets/AdministratorBar";

type User = { id: string; name: string };
type Team = { id: string; name: string };

type FormState = {
  message: string;
  target: "ALL" | "TEAM" | "USER";
  selectedUsers: string[];
  selectedTeamIds: string[];
};

const INITIAL_STATE: FormState = {
  message: "",
  target: "ALL",
  selectedUsers: [],
  selectedTeamIds: [],
};

const AdministratorNotification: React.FC = () => {
  const { token: ctxToken } = useContext(AuthContext);
  const token =
    ctxToken ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get<User[]>("/api/profile/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("❌ Failed to load users:", err);
        alert("Failed to load user list.");
      });

    axios
      .get<Team[]>("/api/teams", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Teams loaded:", res.data);
        setTeams(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to load teams:", err);
        alert("Failed to load team list.");
      });
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value as FormState[keyof FormState],
      ...(name === "target"
        ? { selectedUsers: [], selectedTeamIds: [] }
        : {}),
    }));
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, selectedUsers: selected }));
  };

  const handleTeamSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, selectedTeamIds: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (form.target === "USER" && form.selectedUsers.length === 0) {
      alert("❗ Please select at least one user.");
      return;
    }
    if (form.target === "TEAM" && form.selectedTeamIds.length === 0) {
      alert("❗ Please select at least one team.");
      return;
    }

    const payload = {
      message: form.message,
      target: form.target,
      userIds: form.target === "USER" ? form.selectedUsers : [],
      teamIds: form.target === "TEAM" ? form.selectedTeamIds : [],
      type : form.target === "ALL" ? "ALL" : form.target === "TEAM" ? "TEAM" : "USER",
    };

    console.log("📤 Sending payload:", payload);

    try {
      setLoading(true);
      await axios.post("/api/notifications", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Notification sent!");
      setForm(INITIAL_STATE);
      navigate("/administrator");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ Axios Error:", err.response?.data || err.message);
        alert(`❌ ${err.response?.data || "Failed to send notification."}`);
      } else {
        console.error("❌ Unknown Error:", err);
        alert("❌ Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminsistratorBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto bg-white shadow p-8 rounded-xl space-y-6">
          <h1 className="text-2xl font-bold text-blue-800">📢 Send Notification</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-medium text-sm text-gray-700">Message</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
                placeholder="Type your announcement or message..."
              />
            </div>

            <div>
              <label className="font-medium text-sm text-gray-700">Send To</label>
              <select
                name="target"
                value={form.target}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg bg-gray-50"
              >
                <option value="ALL">All Users</option>
                <option value="TEAM">Select Team</option>
                <option value="USER">Specific Users</option>
              </select>
            </div>

            {form.target === "USER" && (
              <div>
                <label className="font-medium text-sm text-gray-700">
                  Select Users
                </label>
                <select
                  multiple
                  value={form.selectedUsers}
                  onChange={handleUserSelect}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 h-40"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Loading users...</p>
                )}
              </div>
            )}

            {form.target === "TEAM" && (
              <div>
                <label className="font-medium text-sm text-gray-700">Select Teams</label>
                <select
                  multiple
                  value={form.selectedTeamIds}
                  onChange={handleTeamSelect}
                  className="w-full mt-1 p-2 border rounded-lg bg-gray-50 h-40"
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                {teams.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">Loading teams...</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default  AdministratorNotification;
