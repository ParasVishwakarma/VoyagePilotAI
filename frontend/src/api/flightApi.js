import api from "./axios";

export const getFlightsByTrip = async (tripId) => {
    const { data } = await api.get(`/flights/trip/${tripId}`);
    return data;
};

export const getFlightById = async (id) => {
    const { data } = await api.get(`/flights/${id}`);
    return data;
};

export const createFlight = async (tripId, flight) => {
    const { data } = await api.post(`/flights/trip/${tripId}`, flight);
    return data;
};

export const updateFlight = async (id, flight) => {
    const { data } = await api.put(`/flights/${id}`, flight);
    return data;
};

export const deleteFlight = async (id) => {
    const { data } = await api.delete(`/flights/${id}`);
    return data;
};