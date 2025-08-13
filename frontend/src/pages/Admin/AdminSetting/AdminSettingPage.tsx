import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../Authentication/AuthContext";
import AdminSidebarWidget from "../Widgets/AdminSideBar";

interface FormState {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

const AccountSettingsPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          fullName: res.data.name ?? "",
          username: res.data.username ?? "",
          email: res.data.email ?? "",
          password: "",
        });

        const avatarPath = res.data.avatarUrl || res.data.avatar;
        if (avatarPath) {
          const filename = avatarPath.split("/").pop();
          setPreviewUrl(`http://localhost:8080/profile/avatars/${filename}`);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch profile:", err);
        alert("Unauthorized or token expired");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm({ fullName: "", username: "", email: "", password: "" });
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.fullName);
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      await axios.put("/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Profile updated!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Failed to update profile:", err);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebarWidget />

      <main className="flex-1 p-8">
        <div className="flex space-x-8 border-b text-sm font-medium text-gray-500 mb-8">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
            Account Settings
          </button>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-xl shadow p-8 space-y-8"
        >
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-32 h-32 object-cover rounded-full border"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border">
                  No Image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfilePicture(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                className="text-sm"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {/* <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            /> */}
            <Input
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-6 py-2 text-gray-600 hover:underline"
            >
              Reset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

function Input({
  label,
  ...rest
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
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
