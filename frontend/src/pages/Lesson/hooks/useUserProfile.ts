import axios from "axios";
import { useEffect, useState } from "react";

export const useUserProfile = (token: string | null) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [myTeamIds, setMyTeamIds] = useState<string[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [avatarUrl, setavatarUrl] = useState<string | null>(null);

     useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.id);
        setEmail(res.data.email)
        setMyTeamIds(res.data.teams || []);
        setavatarUrl(res.data.avatarUrl || null);
      } catch (error) {
        console.error("❌ Failed to fetch user profile:", error);
      }
    };
    if (token) fetchUserProfile();
    }, [token]);
    return {userId,myTeamIds,email,avatarUrl}
}