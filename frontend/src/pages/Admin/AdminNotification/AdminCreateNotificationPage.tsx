import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";
// import CalendarWidget from "../../../widgets/CalendarWidget";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";

type User = { id: string; name: string; team: string };

type FormState = {
  message: string;
  target: "ALL" | "USER" | "TEAM";
  selectedUsers: string[];
};

const INITIAL_STATE: FormState = {
  message: "",
  target: "ALL",
  selectedUsers: [],
};

const getToken = (ctxToken: string | null | undefined): string | null => {
  return (
    ctxToken ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const AdminCreateNotificationPage: React.FC = () => {
  const { t } = useTranslation("adminnoti");
  const { token: ctxToken } = useContext(AuthContext);
  const token = getToken(ctxToken);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get<User[]>("http://localhost:8080/profile/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("❌ Failed to load users:", err);
        alert("Failed to load user list.");
      });
  }, [token, navigate]);

  if (!token) return null;

  const teams = Array.from(new Set(users.map((u) => u.team))).filter(Boolean);
  const filteredUsers = users.filter((u) => u.team === selectedTeam);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value as FormState[keyof FormState],
      ...(name === "target" && value === "ALL"
        ? { selectedUsers: [], message: prev.message }
        : {}),
    }));
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.currentTarget.selectedOptions, (o) => o.value);
    setForm((prev) => ({ ...prev, selectedUsers: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (form.target !== "ALL" && form.selectedUsers.length === 0) {
      alert("❗ Please select at least one user.");
      return;
    }

    const payload = {
      message: form.message,
      target: form.target,
      userIds: form.target === "ALL" ? [] : form.selectedUsers,
    };

    console.log("📤 Sending payload:", payload);

    try {
      setLoading(true);
      await axios.post("http://localhost:8080/notifications", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Notification sent!");
      setForm(INITIAL_STATE);
      navigate("/admin");
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

  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebarWidget />

      <main className="flex-1 p-10 space-y-6 relative">
        <h1 className="text-2xl font-bold text-blue-800 mb-6">📢 {t("title")}</h1>

        <div className="bg-white shadow-md rounded-xl p-8 max-w-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-base block font-medium text-gray-700">{t("sendTo")}</label>
              <select
                name="target"
                value={form.target}
                onChange={handleChange}
                className="mt-1 w-full p-2 border rounded-xl bg-gray-50"
              >
                <option value="ALL">{t("allUsers")}</option>
                <option value="TEAM">{t("team")}</option>
                <option value="USER">{t("specificUser")}</option>
              </select>
            </div>

            {form.target === "TEAM" && (
              <>
                <div>
                  <label className="block text-base font-medium text-gray-700">{t("selectTeam")}</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => {
                      setSelectedTeam(e.target.value);
                      setForm((prev) => ({ ...prev, selectedUsers: [] }));
                    }}
                    className="mt-1 w-full p-2 border rounded-xl bg-gray-50"
                  >
                    <option value="">-- {t("selectTeam")} --</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTeam && (
                  <div>
                    <label className="block text-base font-medium text-gray-700">{t("selectUser")}</label>
                    <select
                      multiple
                      value={form.selectedUsers}
                      onChange={handleUserSelect}
                      className="mt-1 w-full p-2 border rounded-xl bg-gray-50 h-32"
                    >
                      {filteredUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}

            {form.target === "USER" && (
              <div>
                <label className="block text-base font-medium text-gray-700">{t("selectUser")}</label>
                <select
                  multiple
                  value={form.selectedUsers}
                  onChange={handleUserSelect}
                  className="mt-1 w-full p-2 border rounded-xl bg-gray-50 h-32"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-base font-medium text-gray-700">{t("message")}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border rounded-xl bg-gray-50"
                rows={4}
                placeholder={t("type")}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-10 py-2 rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? t("sending") : t("send")}
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="w-80 hidden lg:block p-6 relative">
        <div className="absolute top-6 right-10 z-10">
          <LanguageSwitcher />
        </div>
        <div className="pt-16" />
        {/* <CalendarWidget /> */}
      </div>
    </div>
  );
};

export default AdminCreateNotificationPage;
