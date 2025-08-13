import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../Authentication/AuthContext";

const AdminAvatarWidget = () => {
  const { token } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    axios.get("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const avatarPath = res.data.avatarUrl || res.data.avatar;
      if (avatarPath) {
        const filename = avatarPath.split("/").pop();
        setAvatarUrl(`/api/profile/avatars/${filename}`);
      }
    })
    .catch(() => console.warn("Failed to fetch admin avatar"));
  }, [token]);

  const handleClick = () => {
    navigate("/admin/setting");
  };

  return (
    <div
      onClick={handleClick}
      className="w-10 h-10 rounded-full overflow-hidden border cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Admin Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
          👤
        </div>
      )}
    </div>
  );
};

export default AdminAvatarWidget;
