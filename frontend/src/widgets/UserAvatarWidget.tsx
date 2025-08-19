// src/widgets/UserAvatarWidget.tsx  (หรือชื่อไฟล์เดิมของคุณ)
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../Authentication/http";

type ProfileResp = {
  name?: string;
  upn?: string;
  email?: string;
  avatar?: string;     // บางแบ็กเอนด์ใช้ชื่อนี้
  avatarUrl?: string;  // บางแบ็กเอนด์ใช้ชื่อนี้
};

const normalizeAvatarUrl = (p?: string | null): string | null => {
  if (!p) return null;
  // กรณีเป็น URL เต็มหรือ data URI → ใช้ได้เลย
  if (/^https?:\/\//i.test(p) || p.startsWith("data:")) return p;
  // กรณีเป็น path/filename → ใช้ pattern ของ backend เดิม
  const filename = p.split("/").pop();
  return filename ? `/api/profile/avatars/${filename}` : null;
};

export default function UserWidget() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const res = await http.get<ProfileResp>("/profile");
        const raw = res.data?.avatarUrl ?? res.data?.avatar ?? null;
        const url = normalizeAvatarUrl(raw);
        if (mounted.current) setAvatarUrl(url);
      } catch {
        // ถ้า 401 → interceptor จะ refresh ให้อัตโนมัติอยู่แล้ว
        // ถ้า refresh ไม่ผ่าน onUnauthenticated จะพาไปหน้า login เอง
        if (mounted.current) setAvatarUrl(null);
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  const handleClick = () => navigate("/settings");

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Open profile settings"
      className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {loading ? (
        <div className="w-full h-full animate-pulse bg-gray-300" />
      ) : avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-full h-full object-cover"
          onError={() => setAvatarUrl(null)} // ถ้ารูปเสีย ให้ fallback เป็นไอคอน
        />
      ) : (
        <span className="text-gray-500 text-xl" aria-hidden>
          👤
        </span>
      )}
    </button>
  );
}
