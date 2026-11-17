import api from "./axios";

export const getNotifications = async () => {
    const { data } = await api.get("/notifications");
    return data;
};

export const markAllNotificationsRead = async () => {
    const { data } = await api.post("/notifications/mark-all-read");
    return data;
};
