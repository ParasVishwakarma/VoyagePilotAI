import api from "./axios";

export const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
};

export const register = async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
};

export const refreshToken = async (token) => {
    const { data } = await api.post("/auth/refresh-token", { refreshToken: token });
    return data;
};

export const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
};

export const resetPassword = async (token, newPassword) => {
    const { data } = await api.post("/auth/reset-password", { token, newPassword });
    return data;
};
