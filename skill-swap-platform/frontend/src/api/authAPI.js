import axiosClient from './axiosClient';

export const registerRequest = (formData) => axiosClient.post('/auth/register', formData);
export const loginRequest = (email, password) => axiosClient.post('/auth/login', { email, password });
export const logoutRequest = () => axiosClient.post('/auth/logout');
export const getMeRequest = () => axiosClient.get('/auth/me');
export const updateProfileRequest = (updates) => axiosClient.put('/users/profile', updates);
