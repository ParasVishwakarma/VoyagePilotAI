import api from "./axios";

export const getMyTrips = async (page = 0, size = 10) => {
    const { data } = await api.get(`/trips?page=${page}&size=${size}`);
    return data;
};

export const getTripById = async (id) => {
    const { data } = await api.get(`/trips/${id}`);
    return data;
};

export const createTrip = async (trip) => {
    const { data } = await api.post("/trips", trip);
    return data;
};

export const updateTrip = async (id, trip) => {
    const { data } = await api.put(`/trips/${id}`, trip);
    return data;
};

export const deleteTrip = async (id) => {
    const { data } = await api.delete(`/trips/${id}`);
    return data;
};