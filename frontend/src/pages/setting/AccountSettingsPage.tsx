import { useEffect, useState } from "react";
import axios from "axios";
import SidebarWidget from "../../widgets/SidebarWidget";
import { useNavigate } from "react-router-dom";

interface FormState {
  fullName: string;
  email: string;
}

const AccountSettingsPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ fullName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // ✅ withCredentials must be top-level (not inside headers)
    axios
      .get("/api/profile", { withCredentials: true })
      .then((res) => {
        setForm({
          fullName: res.data.name ?? "",
          email: res.data.email ?? "",
        });

        const avatarUrl: string | undefined = res.data.avatarUrl;
        if (avatarUrl) {
          const filename = avatarUrl.split("/").pop();
          if (filename) setPreviewUrl(`/api/profile/avatars/${filename}`);
        }
      })
      .catch((err) => {
        // Only send user to login on an actual 401
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/", { replace: true });
        } else {
          alert("Failed to load profile.");
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const reset = () => {
    setForm({ fullName: "", email: "" });
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.fullName);
    formData.append("email", form.email);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      // ✅ withCredentials is top-level; headers only for content-type
      await axios.put("/api/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Profile updated!");
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/", { replace: true });
      } else {
        alert("Update failed");
        console.error(err);
      }
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
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border"
                  onError={() => setPreviewUrl(null)}
                />
              ) : (
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-sm text-gray-400">
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
                className="text-sm text-gray-600"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Full name" name="fullName" value={form.fullName} onChange={handleChange} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} disabled />
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Update Profile
            </button>
            <button type="button" onClick={reset} className="px-6 py-2 text-gray-600 hover:underline">
              Reset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

function Input(
  { label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>
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
