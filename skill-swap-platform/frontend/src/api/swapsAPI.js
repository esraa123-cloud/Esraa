import axiosClient from './axiosClient';

export const fetchSwapsRequest = () => axiosClient.get('/swaps');
export const createSwapRequest = (payload) => axiosClient.post('/swaps', payload);
export const updateSwapStatusRequest = (id, status) => axiosClient.patch(`/swaps/${id}`, { status });
