import axiosClient from './axiosClient';

export const fetchChatsRequest = () => axiosClient.get('/chats');
export const startChatRequest = (peerName) => axiosClient.post('/chats/start', { peerName });
export const sendMessageRequest = (chatId, text) => axiosClient.post(`/chats/${chatId}/messages`, { text });
