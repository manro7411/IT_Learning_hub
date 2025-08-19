import axios from "axios";
import { useEffect, useState } from "react";

export const useTeam = (token: string | null) => {
    const [myTeamIds, setMyTeamIds] = useState<string[]>([]);

      useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get("/api/teams", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyTeamIds(res.data.map((team: { id: string }) => team.id));
      } catch (error) {
        console.error("❌ Failed to fetch user teams:", error);
      }
    };
    if (token) fetchTeams();
    }, [token]);

    return myTeamIds

}