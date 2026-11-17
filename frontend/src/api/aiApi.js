import api from "./axios";

export const generateRecommendation = async (disruptionId) => {
    const { data } = await api.post(`/ai/recommend/${disruptionId}`);
    return data;
};

export const getAllRecommendations = async () => {
    const { data } = await api.get("/recommendations");
    return data;
};

export const getDisruptionRecommendations = async (disruptionId) => {
    const { data } = await api.get(`/recommendations/disruption/${disruptionId}`);
    return data;
};

export const acceptRecommendation = async (id) => {
    const { data } = await api.put(`/recommendations/${id}/accept`);
    return data;
};

export const rejectRecommendation = async (id) => {
    const { data } = await api.put(`/recommendations/${id}/reject`);
    return data;
};

export const getTravelAdvice = async (params = {}) => {
    const { data } = await api.post("/ai/advice", params);
    return data;
};
