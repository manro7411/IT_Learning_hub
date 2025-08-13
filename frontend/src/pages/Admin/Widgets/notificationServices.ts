import axios from "axios";

export async function sendLessonNotification({
    token,
    message,
    userIds = [],
    teamIds = [],
    target,
}:{
    token: string;
    message: string;
    userIds?: string[];
    teamIds?: string[];
    target: "ALL" | "TEAM" | "USER";
}){
    const payload = {
        message,
        target,
        userIds: target === "USER" ? userIds: [],
        teamIds: target === "TEAM" ? teamIds: [],
        type: target,
    }
    await axios.post("/api/notifications",payload, {
        headers: {Authorization:`Bearer ${token}`}

    });

}