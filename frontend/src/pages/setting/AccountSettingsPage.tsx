// src/pages/settings/AccountSettingsPage.tsx
import { useEffect, useState } from "react";
import SidebarWidget from "../../widgets/SidebarWidget";
import { useNavigate } from "react-router-dom";
import { http } from "../../Authentication/http";

interface FormState {
  fullName: string;
  email: string;
}

type ProfileResp = {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
};

const normalizeAvatarUrl = (p?: string | null): string | null => {
  if (!p) return null;
  // ถ้าเป็น absolute URL หรือ data: ให้ใช้ตามนั้น
  if (/^https?:\/\//i.test(p) || p.startsWith("data:")) return p;
  // ถ้าเป็น path จาก backend → แยก filename แล้วเสิร์ฟจาก /api/profile/avatars/:filename
  const filename = p.split("/").pop();
  return filename && filename !== "null" ? `/api/profile/avatars/${filename}` : null;
};

const AccountSettingsPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // โหลดโปรไฟล์ (ผ่านคุกกี้ + interceptor)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await http.get<ProfileResp>("/profile");
        if (cancelled) return;

        setForm({
          fullName: res.data.name ?? "",
          email: res.data.email ?? "",
        });

        const avatar = normalizeAvatarUrl(res.data.avatarUrl || res.data.avatar);
        setPreviewUrl(avatar);
      } catch (e) {
        // ถ้า 401 → interceptor จะเรียก /login/refresh ให้เอง
        // ถ้า refresh ไม่ผ่าน http.ts จะ redirect → "/" ให้อยู่แล้ว
        setError("Failed to load profile");
        console.error("❌ Load profile error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // เคลียร์ object URL ตอน unmount กัน memory leak
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const reset = () => {
    setForm({ fullName: "", email: "" });
    setProfilePicture(null);
    // เคลียร์ preview เฉพาะกรณีเป็น blob
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.append("name", form.fullName);
    formData.append("email", form.email);
    if (profilePicture) formData.append("profilePicture", profilePicture);

    try {
      // ไม่ต้องใส่ Authorization header เพราะใช้คุกกี้ HttpOnly
      // ปล่อยให้ axios ตั้ง Content-Type multipart เองจาก FormData (ไม่ต้องกำหนด boundary)
      await http.put("/profile", formData);
      alert("✅ Profile updated!");
      navigate("/dashboard");
    } catch (e) {
      console.error("❌ Update profile error:", e);
      setError("Update failed");
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
                    // ล้าง blob เดิมก่อนสร้างใหม่
                    if (previewUrl?.startsWith("blob:")) {
                      URL.revokeObjectURL(previewUrl);
                    }
                    setPreviewUrl(URL.createObjectURL(file));
                  }
                }}
                className="text-sm text-gray-600"
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
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

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
