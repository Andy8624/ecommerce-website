// import axios from './axios-customize';

// export const getChatMessages = async (senderId, recipientId) => {
//     const path = `/api/v1/messages/${senderId}/${recipientId}`;
//     const res = await axios.get(path);
//     return res?.data;
// };

// export const getContacts = async (userId) => {
//     const path = `/api/v1/messages/contacts/${userId}`;
//     const res = await axios.get(path);
//     return res?.data;
// };

// export const createChatMessage = (senderId, recipientId, content) => {
//     return {
//         senderId,
//         recipientId,
//         content,
//         timestamp: new Date()
//     };
// };

// export default {
//     getChatMessages,
//     getContacts,
//     createChatMessage
// };