import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";


const UserWidget = () => {
  const { token } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const avatarPath: string | undefined = res.data.avatarUrl || res.data.avatar;

        if (avatarPath) {
          const filename = avatarPath.split("/").pop();
          if (filename) {
            setAvatarUrl(`http://localhost:8080/profile/avatars/${filename}`);
          }
        }
      })
      .catch(() => {
        console.warn("Could not fetch avatar.");
      });
  }, [token]);


  const handleClick = () => {
    navigate("/settings");
  }

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center" onClick={handleClick}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-gray-500 text-xl">👤</span>
      )}
    </div>
  );
};

export default UserWidget;
