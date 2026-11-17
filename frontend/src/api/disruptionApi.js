import api from "./axios";

/**
 * Get all disruptions
 */
export const getDisruptions = async () => {
    const { data } = await api.get("/disruptions");
    return data;
};

/**
 * Get disruption by ID
 */
export const getDisruptionById = async (id) => {
    const { data } = await api.get(`/disruptions/${id}`);
    return data;
};

/**
 * Get all disruptions for a flight
 */
export const getFlightDisruptions = async (flightId) => {
    const { data } = await api.get(`/disruptions/flight/${flightId}`);
    return data;
};

/**
 * Create disruption
 */
export const createDisruption = async (request) => {
    const { data } = await api.post("/disruptions", request);
    return data;
};

/**
 * Update disruption
 */
export const updateDisruption = async (id, request) => {
    const { data } = await api.put(`/disruptions/${id}`, request);
    return data;
};

/**
 * Delete disruption
 */
export const deleteDisruption = async (id) => {
    await api.delete(`/disruptions/${id}`);
};

/**
 * Generate AI Recommendation
 */
export const generateAIRecommendation = async (disruptionId) => {
    const { data } = await api.post(
        `/ai/recommend/${disruptionId}`
    );
    return data;
};