import axiosClient from './axiosClient';

export const fetchSkillsRequest = (params = {}) => axiosClient.get('/skills', { params });
export const createSkillRequest = (skill) => axiosClient.post('/skills', skill);
export const deleteSkillRequest = (id) => axiosClient.delete(`/skills/${id}`);
