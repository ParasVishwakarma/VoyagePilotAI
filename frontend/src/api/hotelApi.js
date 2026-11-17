import api from "./axios";

export const getHotelsByTrip = async (tripId) => {
    const { data } = await api.get(`/hotels/trip/${tripId}`);
    return data;
};

export const getAllHotels = async () => {
    const { data } = await api.get("/hotels");
    return data;
};

export const getHotel = async (id) => {
    const { data } = await api.get(`/hotels/${id}`);
    return data;
};

export const createHotel = async (tripId, hotelData) => {
    const { data } = await api.post(`/hotels/trip/${tripId}`, hotelData);
    return data;
};

export const updateHotel = async (id, hotelData) => {
    const { data } = await api.put(`/hotels/${id}`, hotelData);
    return data;
};

export const deleteHotel = async (id) => {
    const { data } = await api.delete(`/hotels/${id}`);
    return data;
};
