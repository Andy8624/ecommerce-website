import axios_customize from "./axios-customize";

export const getMessagesBetweenUsers = async (userId1, userId2) => {
    try {
        console.log("🚀 Đang lấy tin nhắn giữa", userId1, "và", userId2);
        const res = await axios_customize.get(`/api/v1/messages/${userId1}/${userId2}`);
        console.log("📩 Tin nhắn nhận được:", res?.data);
        return res?.data || [];
    } catch (error) {
        console.error("⚠️ Lỗi khi lấy tin nhắn:", error);
        return [];
    }
};
