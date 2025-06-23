// src/pages/Settings/AccountSettingsPage.tsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import SidebarWidget from "../../widgets/SidebarWidget";
import { AuthContext } from "../../Authentication/AuthContext";
import {useNavigate} from "react-router-dom";

interface FormState {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const AccountSettingsPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);


  const [form, setForm] = useState<FormState>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    axios
        .get("http://localhost:8080/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
            setForm({
              fullName: res.data.name      ?? "",
              username: res.data.username  ?? "",
              email:    res.data.email     ?? "",
              password: res.data.password  ?? "",
            })
        )
        .catch(() => alert("Unauthorized or token expired"))
        .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () =>
      setForm({ fullName: "", username: "", email: "", password: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
          "http://localhost:8080/profile",
          {
            name:     form.fullName,
            username: form.username,
            email:    form.email,
            password: form.password,
          },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Profile updated!");
      navigate("/dashboard");

    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
      <div className="min-h-screen bg-gray-100 flex">
        <SidebarWidget />
        <main className="flex-1 p-8">
          <div className="flex space-x-8 border-b text-sm font-medium text-gray-500 mb-8">
            <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
              Account Setting
            </button>
          </div>

          <form onSubmit={submit} className="bg-white rounded-xl shadow p-8 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Profile Picture
              </label>
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-400">
                Upload your photo
              </div>
            </div>

            {/* Grid – 4 field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full name"  name="fullName" value={form.fullName}  onChange={handleChange}/>
              <Input label="Email"      name="email"    value={form.email}     onChange={handleChange}/>
              <Input label="Username"   name="username" value={form.username}  onChange={handleChange}/>
              <Input label="Password"   name="password" value={form.password}  onChange={handleChange} type="password"/>
            </div>

            <div className="flex space-x-4">
              <button type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Profile
              </button>
              <button type="button" onClick={reset}
                      className="px-6 py-2 text-gray-600 hover:underline">
                Reset
              </button>
            </div>
          </form>
        </main>
      </div>
  );
};

function Input(
    { label, ...rest }:
        { label: string } & React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            {...rest}
            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg"
        />
      </div>
  );
}

export default AccountSettingsPage;
